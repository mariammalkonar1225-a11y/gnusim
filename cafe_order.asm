
; BREW & BYTE - Cafe Bill Processor
; 8085 Assembly Language Program
; Calculate total bill for three menu items

; INPUT:
; 2050H = First item price
; 2051H = Second item price
; 2052H = Third item price

; OUTPUT:
; 2053H = Total bill

        LDA 2050H       ; Load first item price
        MOV B,A         ; Save first price in B

        LDA 2051H       ; Load second item price
        ADD B           ; Add first price to second price
        MOV B,A         ; Save intermediate total in B

        LDA 2052H       ; Load third item price
        ADD B           ; Add third price to intermediate total

        STA 2053H       ; Store final total bill
        HLT             ; Stop program
