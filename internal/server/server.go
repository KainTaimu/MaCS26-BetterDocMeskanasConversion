package server

import (
	"convert2pdf/internal/errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strings"
)

type Request struct {
	Blob []byte `json:"file"`
}

const origin = "https://meskanas.macewan.ca"
const serverUrl = "https://localhost" + port
const port = ":6767"

func StartServer() {
	mux := http.NewServeMux()
	mux.HandleFunc("/request", processRequest)

	wd, err := os.Getwd()
	if err != nil {
		return
	}

	fmt.Println("Converted files will be stored in " + wd + "/")
	fmt.Println("Listening at localhost" + port)
	fmt.Println(strings.Repeat("=", 64))
	http.ListenAndServe(port, checkCORS(mux))
}

var methodAllowlist = []string{"POST", "OPTIONS"}

// Erwin: Had an issue with the POST request due to this thing called CORS.
// CREDIT: https://eli.thegreenplace.net/2023/introduction-to-cors-for-go-programmers/
func checkCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", strings.Join(methodAllowlist, ", "))
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func processRequest(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		errors.PrintErrf("only POST allowed: got %s", r.Method)
		return
	}

	file, header, err := r.FormFile("file")
	if err != nil {
		errors.PrintErrf("failed to form file: %s", err.Error())
		return
	}
	defer file.Close()

	log.Printf("Processing: %s\n", header.Filename)

	outFile, err := os.Create(header.Filename)
	if err != nil {
		errors.PrintErrf("failed to create file: %s", err.Error())
		return
	}
	defer outFile.Close()

	io.Copy(outFile, file)
	w.Write([]byte("ok"))

	if err := convertToPdf(header.Filename); err != nil {
		errors.PrintErrf("failed to convert file: %s", err.Error())
		return
	}
}

func convertToPdf(file string) error {
	args := []string{"--headless", "--convert-to", "pdf", file}
	cmd := exec.Command("soffice", args...)

	if err := cmd.Start(); err != nil {
		return fmt.Errorf("failed to start soffice: %w", err)
	}
	if err := cmd.Wait(); err != nil {
		return fmt.Errorf("soffice failed to convert file: %w", err)
	}
	log.Printf("Done: %s\n", file)

	return nil
}
