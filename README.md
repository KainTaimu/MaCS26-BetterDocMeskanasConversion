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
# cd into your directory where you want the converted file to go
cd ~/Downloads/

# run the server
convert2pdf
```
Then, go to your meskanas course page and click on the new lighting icon beside
the original convert button.
A browser popup will request permissions to allow access to local networks.
Hit accept.
If everything goes smoothly, you should see the terminal running `convert2pdf`
output something like:
```bash
Converted files will be stored in /home/user/Downloads/test/
Listening at localhost:6767
================================================================
2026/10/18 10:49:18 Processing: Powerpoint.pptx
2026/10/18 10:49:22 Done: Powerpoint.pptx
```
and you will see your converted file in the same directory you ran `convert2pdf`
on.


### Details
This project consists of two parts. A userscript that you install on your
browser using (TamperMonkey)[https://www.tampermonkey.net/], and a Go server
that does the file conversion for you.

The userscript adds a new button to the right of the original Meskanas
conversion button on supported file types. When clicked, its fetches the file
and POSTs it to the Go server running on `http://localhost:6767`

The server then runs it through LibreOffice's `soffice` which does the
conversion to a PDF.


