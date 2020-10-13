/*
A script to test Vercel serverless function and CDN.

Usage: `go run ./main.go`
*/
package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"regexp"
	"time"
)

var requestCount = 0

func req(url string, needBody bool) string {
	startTime := time.Now().UnixNano() / 1000000
	resp, err := http.Get(url)

	endTime := time.Now().UnixNano() / 1000000

	if err != nil {
		fmt.Printf("%d\t%d\t%d\terror:%s url:%s\n", startTime, requestCount, endTime-startTime, err.Error(), url)
		return ""
	}
	defer resp.Body.Close()
	fmt.Printf("%d\t%d\t%d\tstatus:%d url:%s\n", startTime, requestCount, endTime-startTime, resp.StatusCode, url)

	if needBody && resp.StatusCode == http.StatusOK {
		bodyBytes, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Fatal(err)
		}
		bodyString := string(bodyBytes)
		return bodyString
	}
	return ""
}

func runTest() {
	requestCount++

	bodyString := req("https://rino.app/sign-in", true)

	cssUrl := ""
	found := regexp.MustCompile(`href="(\S+.css)"`).FindStringSubmatch(bodyString)
	if len(found) >= 2 {
		cssUrl = found[1]
	}

	if cssUrl != "" {
		cssUrl = "https://rino.app" + cssUrl
		req(cssUrl, false)
	}
}

func main() {
	for {
		runTest()
		time.Sleep(20 * time.Millisecond)
	}
}
