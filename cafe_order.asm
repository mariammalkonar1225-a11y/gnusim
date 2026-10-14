
; BREW & BYTE - Cafe Bill Processor
; GNUSim8085 Assembly Program
;
; Input:
; 2050H = subtotal in rupees (8-bit unsigned value)
;
; Output:
; 2051H = discount (0AH if subtotal >= 64H, otherwise 00H)
; 2052H = final payable amount
;
; Rule: Orders >= Rs.100 receive a fixed Rs.10 discount.
; All values are hexadecimal in memory.

        LDA 2050H       ; Load subtotal into accumulator
        CPI 64H         ; Compare subtotal with 100 decimal
        JC NO_DISCOUNT  ; If subtotal < 100, jump

        SUI 0AH         ; Deduct Rs.10 from subtotal
        STA 2052H       ; Store final payable amount

        MVI A, 0AH      ; Load discount = 10 decimal
        STA 2051H       ; Store discount
        HLT

NO_DISCOUNT:
        LDA 2050H       ; Reload original subtotal
        STA 2052H       ; Payable amount = subtotal

        MVI A, 00H      ; Load zero discount
        STA 2051H       ; Store discount
        HLT