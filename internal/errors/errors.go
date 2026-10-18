package errors

import (
	"fmt"
	"github.com/fatih/color"
	"log"
)

func PrintErrf(s string, a ...any) {
	log.Println(color.RedString(fmt.Sprintf(s, a...)))
}
