package handler

import (
	"net/http"
	"os"
	"path"
	"strings"
)

const staticDir = "dist"

// fileExists checks if a file exists and is not a directory before we
// try using it to prevent further errors.
func fileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}
	return !info.IsDir()
}

var filePathCache map[string]string

func getPossibleFilePaths(name string) []string {
	var nameWithSlash, nameWithoutSlash string
	if strings.HasSuffix(name, "/") {
		nameWithSlash, nameWithoutSlash = name, name[:len(name)-1]
	} else {
		nameWithSlash, nameWithoutSlash = name+"/", name
	}
	possibleFilePaths := []string{
		path.Join(staticDir, nameWithoutSlash),
		path.Join(staticDir, nameWithSlash+"index.html"),
		path.Join(staticDir, nameWithoutSlash+"/index.html"),
		path.Join(staticDir, nameWithoutSlash+".html"),
	}
	return possibleFilePaths
}

func getFilePath(name string) (filePath string, found bool) {
	var notFoundFilePath = path.Join(staticDir, "404.html")

	if filePathCache == nil {
		filePathCache = make(map[string]string)
	} else if filePath, ok := filePathCache[name]; ok {
		if filePath == notFoundFilePath {
			return notFoundFilePath, false
		}
		return filePath, true
	}

	for _, filePath := range getPossibleFilePaths(name) {
		if fileExists(filePath) {
			filePathCache[name] = filePath
			return filePath, !(filePath == notFoundFilePath)
		}
	}

	filePathCache[name] = notFoundFilePath
	return notFoundFilePath, false
}

func fileHandle(w http.ResponseWriter, r *http.Request) {
	filePath, found := getFilePath(r.URL.Path)
	http.ServeFile(w, r, filePath)

	w.Header().Set("Cache-Control", "maxage=60, s-maxage=120, stale-while-revalidate")
	if !found {
		w.WriteHeader(404)
	}
}

// Handle replies to the request with the contents of the named
// file or directory.
func Handle(w http.ResponseWriter, r *http.Request) {
	fileHandle(w, r)
}
