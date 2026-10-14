
; BREW & BYTE - Cafe Bill Processor
; 8085 Assembly Language Program
;
; INPUT MEMORY LOCATIONS:
; 2050H = Price of item 1
; 2051H = Price of item 2
; 2052H = Price of item 3
;
; OUTPUT MEMORY LOCATIONS:
; 2053H = Total bill
; 2054H = Discount
; 2055H = Final payable amount
;
; Rule: Bills of Rs.100 or more receive Rs.10 discount.
; All values are stored in hexadecimal.

        LDA 2050H       ; Load first item price
        MOV B,A         ; Save first price in register B

        LDA 2051H       ; Load second item price
        ADD B           ; Add first price to second price
        MOV B,A         ; Save running total in B

        LDA 2052H       ; Load third item price
        ADD B           ; Add third price to running total
        STA 2053H       ; Store total bill

        CPI 64H         ; Compare total with Rs.100
        JC NO_DISCOUNT  ; Jump if total is below Rs.100

        SUI 0AH         ; Subtract Rs.10 discount
        STA 2055H       ; Store final payable amount

        MVI A,0AH       ; Load discount value Rs.10
        STA 2054H       ; Store discount
        HLT

NO_DISCOUNT:
        LDA 2053H       ; Reload total bill
        STA 2055H       ; Payable amount = total bill

        MVI A,00H       ; Set discount to zero
        STA 2054H       ; Store zero discount
        HLT
