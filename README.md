# tab-share
```
share your guitar track and collaborate with others!
```

## .tab file spec
byte 0 : if 127 then index changed  
byte 1 : tempo [0-9]  
0 : whole note  
1 : half note  
2 : quater note  
3 : eighth note  
4 : sixtheenth note  
5 : whole rest  
6 : half rest  
7 : quarter rest  
8 : eighth rest  
9 : sixteenth rest  
byte 2-7 : string [1-6] fret [0-25] if n then not touch if x then x  
byte pair : [string] [fret] [E A D G B e] [0-25]
  
### example  
```
127 2 n n 2 3 3 1  
127 3 x x 4 5 5 3  
127 8  
127 3 'E' 6  
127 3 'E' 6 'A' 8  
127 3 'D' 8  
127 3 'G' 7  
                 ^
e||-----------x-----------------|----
B||-----------x-----------------|----
G||-----2-----4--------------7--|----
D||-----3-----5-----------8-----|----
A||-----3-----5--------8--------|----
E||-----1-----3-----6--6--------|----
```