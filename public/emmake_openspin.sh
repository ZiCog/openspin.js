#!/bin/bash

cd OpenSpin

make clean

# Build a LLVM bitcode file "openspin"
emmake make

# Make that bit code file because emscripten is fussy about names.
cp openspin openspin.bc

# Compile the bit code to Javascript with an HTML wrapper

#emcc -s CORRUPTION_CHECK=1 -s TOTAL_MEMORY=134217728  -o openspin.html --pre-js ../openspin-pre.js --post-js ../openspin-post.js openspin.bc

#emcc -s UNALIGNED_MEMORY=1 -s TOTAL_MEMORY=134217728  -o openspin.html --pre-js ../openspin-pre.js --post-js ../openspin-post.js openspin.bc

#emcc -s CHECK_HEAP_ALIGN=1 -s TOTAL_MEMORY=134217728  -o openspin.html --pre-js ../openspin-pre.js --post-js ../openspin-post.js openspin.bc

emcc  -O2                   -s TOTAL_MEMORY=134217728  -o openspin.html --pre-js ../openspin-pre.js --post-js ../openspin-post.js openspin.bc


cd ..

cp OpenSpin/openspin.js .


