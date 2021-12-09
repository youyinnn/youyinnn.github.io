## LaTeX

### Vscode `.tex` `file formatting on save

Tools:

1. LaTeX-Workshop extension;
2. latexindent.pl
3. Save and Run extension(optional);

#### Toggle formatter

##### Option 1

While using LaTeX-Workshop+latexindent.pl, it will never toggle the indent process.

 I fix it by replace the extension's setting:

``` json
{
  "latex-workshop.latex.recipes": [
    {
      "name": "latexmk 🔃",
      // add tool "latexindent" as the second step of this recipes
      "tools": ["latexmk", "latexindent"]
    },
  ],
  "latex-workshop.latex.tools": [
    // previous tools should be remained ....
    
    // adding a new tool named latexindent
    {
      "name": "latexindent",
      "command": "latexindent",
      "args": ["%DOC_EXT%", "-w"],
      "env": {}
    }
  ]
} 
```

##### Option 2: Extension "Save and Run"

``` json
"saveAndRun": {
  "commands": [
    {
      "match": "\\.tex$",
      "cmd": "latexindent '${file}' -o '${file}' -s -g /dev/null",
      "useShortcut": false,
      "silent": true
    }
  ]
}
```

#### Environment modules for latexindent.pl

Refer to: https://latexindentpl.readthedocs.io/en/latest/appendices.html#mac

#### no backup file and log file

`-o`: no backup;

`-g /dev/null`: no log;

``` bash
latexindent '${file}' -o '${file}' -s -g /dev/null"
```



#### Update latexindent.pl

The latexindent.pl which brought by MacTex might out of date. Replace it manually by replacing it on the mac.

It might located at:

``` bash
/usr/local/texlive/2021/texmf-dist/scripts/latexindent/LatexIndent/
```



#### Latex Trick

1. use url nicely:

   [How do you get nicely formatted URLs in the bibliography?](https://www.kronto.org/thesis/tips/url-formatting.html)

   [[How do I specify color in RGB using \hypersetup in hyperref?](https://tex.stackexchange.com/questions/4503/how-do-i-specify-color-in-rgb-using-hypersetup-in-hyperref)](https://tex.stackexchange.com/questions/4503/how-do-i-specify-color-in-rgb-using-hypersetup-in-hyperref/4506#4506)

   [I'm trying to include URLs in my .tex or .bib, but I got an error "Missing $ inserted"](https://www.overleaf.com/learn/latex/Questions%2FI%27m_trying_to_include_URLs_in_my_.tex_or_.bib%2C_but_I_got_an_error_%22Missing_%24_inserted%22)

2. first line indent: [No indent in the first paragraph in a section?](https://tex.stackexchange.com/questions/39227/no-indent-in-the-first-paragraph-in-a-section)

3. line space: https://zhuanlan.zhihu.com/p/138408387

4. [Using subfloat to place figures side by side](https://tex.stackexchange.com/questions/111822/using-subfloat-to-place-figures-side-by-side)

5. [Warning: a possible image without description](https://tex.stackexchange.com/questions/467491/warning-a-possible-image-without-description)

6. [How to remove Author's addresses in acm art?](https://tex.stackexchange.com/questions/456063/how-to-remove-authors-addresses-in-acm-art)

7. [How to remove the copyright box on a paper that uses the ACM sig-alternate.cls class file?](https://tex.stackexchange.com/questions/21536/how-to-remove-the-copyright-box-on-a-paper-that-uses-the-acm-sig-alternate-cls-c)

8. [Subfloat vertical alignment in latex](https://tex.stackexchange.com/questions/296624/subfloat-vertical-alignment-in-latex)

9. [Context Sensitive Quotation Facilities](https://mirror.csclub.uwaterloo.ca/CTAN/macros/latex/contrib/csquotes/csquotes.pdf)

10. [How to create fixed width table columns with text raggedright/centered/raggedleft?](https://tex.stackexchange.com/questions/12703/how-to-create-fixed-width-table-columns-with-text-raggedright-centered-raggedlef)

11. [Centering figure captions in IEEEtran](https://tex.stackexchange.com/questions/100434/centering-figure-captions-in-ieeetran)

12. [Referencing subfigures in main caption (with \subfloat and \subref)](https://tex.stackexchange.com/questions/62636/referencing-subfigures-in-main-caption-with-subfloat-and-subref)

13. [Make more lines fit on the page in the scrreprt class](https://tex.stackexchange.com/questions/14144/make-more-lines-fit-on-the-page-in-the-scrreprt-class)

14. [Fancyhdr and scrreprt](https://tex.stackexchange.com/questions/161439/fancyhdr-and-scrreprt) header on scrreprt

15. [Text alignment on top with multirow command](https://tex.stackexchange.com/questions/74108/text-alignment-on-top-with-multirow-command)

16. [Cross-Reference with custom text](https://tex.stackexchange.com/questions/70143/cross-reference-with-custom-text)

17.  [Center column with specifying width in table (tabular enviroment)?](https://tex.stackexchange.com/questions/5017/center-column-with-specifying-width-in-table-tabular-enviroment)

18. [\newcommand argument confusion](https://tex.stackexchange.com/questions/117358/newcommand-argument-confusion)

19. [Why does \\ not return a new line in an equation?](https://tex.stackexchange.com/questions/194236/why-does-not-return-a-new-line-in-an-equation)

15. 

