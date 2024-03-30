#! /bin/sh
echo "======================================================================"
echo "Welcome to to the setup. This will setup the local virtual env."
echo "And then it will install all the required python libraries."
echo "You can rerun this without any issues."
echo "----------------------------------------------------------------------"
if [ -d ".env" ]; then
    echo "Enabling virtual env"
else
    echo "No Virtual env. Please run setup.sh first"
    exit N
fi

# Activate virtual env
. .env/bin/activate
export ENV=development
export CUDA_VISIBLE_DEVICES=""
# export GOOGLE_API_KEY="AIzaSyCGOYJNkoztEVxDN28qgzhe1VCb-RGSh6c"
export GOOGLE_API_KEY="AIzaSyDHGyOwgRGKFee8LJhpsdUGfHQskf55AXY"
export GOOGLE_CSE_ID="202fedc3a39114b67"
fuser -n tcp -k 5000
python3 main.py
deactivate
