package main

import (
	"fmt"
	"os"

	"github.com/fatih/color"
	"github.com/unicorn-rentals-04/unicorn-trading/cli/cmd"
)

func main() {
	if err := cmd.Execute(cmd.NewReporterBackend()); err != nil {
		msg := color.HiRedString("x %s\n", err.Error())
		_, _ = fmt.Fprint(os.Stderr, msg)
		os.Exit(1)
	}
}
