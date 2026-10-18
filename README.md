# BetterDocMeskanasConversion

---

### Submission for MaCS Hackathon '26
Meskanas has a cool feature that lets you convert most proprietary documents that are harder
to view on devices other than on desktop, ie: PowerPoint pptx, Word docx.

But its so dog slow... So much so that they email you when its done converting,
a few minutes after you requested it. 

This project aims to provide a faster and more convenient way of doing the same
job by adding a new button to the Meskanas page that converts the file locally
on your device instead of whatever Meskanas is doing behind the scenes.

Note that this is tested on Linux only. Not sure how it will work on Windows

### Prerequisites
- LibreOffice
```bash
# Debian / Ubuntu
sudo apt install libreoffice

# Arch
sudo pacman -S libreoffice-still
```
- A userscript manager
    - I personally use [TamperMonkey](https://www.tampermonkey.net/) on Firefox,
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


