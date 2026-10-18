# BetterDocMeskanasConversion

---

### Submission for MaCS Hackathon '26
A reinvention of MacEwan's document conversion tool that takes too damn long to
do its job. 


### Prerequisites
- LibreOffice
```bash
# Debian / Ubuntu
sudo apt install libreoffice

# Arch
sudo pacman -S libreoffice-still
```
- A userscript manager
    - I personally use (TamperMonkey)[https://www.tampermonkey.net/] on Firefox,
    any other setup is untested!


### Build and install
```bash
# Make sure ~/go/bin is in your PATH
go install 
```

### Usage
```bash
convert2pdf
```

### Details
This project consists of two parts. A userscript that you install on your
browser using (TamperMonkey)[https://www.tampermonkey.net/], and a Go server
that does the file conversion for you.

The userscript adds a new button to the right of the original Meskanas
conversion button on supported file types. When clicked, its fetches the file
and POSTs it to the Go server running on `http://localhost:6767`

The server then runs it through LibreOffice's `soffice` which does the
conversion to a PDF.


