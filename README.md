# inspect-dir

A small app that provides information on files in a given directory. 

## Usage

On Mac & Linux:

```bash
# Set listening port
export INSPECT_PORT=8080

# Set inspected directory
export INSPECT_DIR=/Users/foo/some_folder/

# Start listening
node index.js
```

On Windows:

```powershell
# Set listening port
$env:INSPECT_PORT = 8080

# Set inspected directory
$env:INSPECT_DIR = "C:\some_folder"

# Start listening
node index.js
```

## Proof of Concept

This was built as a proof of concept for a larger application. I wanted to have a working version of a small app that gives me certain information on the files in a particular directory. I'd like to make this useful for others. 

