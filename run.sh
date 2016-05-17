#!/bin/bash

APP_NAME="xiaoji_home.js"
APP_LOG="${PWD}/${APP_NAME%.js}.log"
SERVER_PORT=3000

start_app() {
    PORT=${SERVER_PORT} node ${APP_NAME} &> ${APP_LOG} &
    echo -e "* Starting ${APP_NAME} on port \e[0;31m${SERVER_PORT}\e[0m, log into \e[0;31m`basename ${APP_LOG}`\e[0m."
}


PID_TO_BE_KILLED=$(netstat -ntpl | grep ${SERVER_PORT}  | awk '{print $7}' | cut -d '/' -f 1)

case "$1" in 
	"-h" | "--help" )
	   echo "Usage:"
           echo "       `basename "$0"`    :  启动${APP_NAME}于端口${SERVER_PORT}."
           echo "       `basename "$0"` -k :  杀掉${APP_NAME}." 
           echo "       `basename "$0"` -r :  重启${APP_NAME}." 
	   exit 0
	   ;;
	"" )
	    [ ! -z ${PID_TO_BE_KILLED} ] && echo -e "* There is one instance(PID:\e[0;31m${PID_TO_BE_KILLED}\e[0m) of ${APP_NAME} running on port ${SERVER_PORT}..." && exit 1
	    start_app
	    exit 0
	    ;;
	"-k" )
	    [ -z ${PID_TO_BE_KILLED} ] && echo "* There is no instance of ${APP_NAME} running..." && exit 1
	    kill -15 ${PID_TO_BE_KILLED} && echo "* Killing ${APP_NAME}(PID:${PID_TO_BE_KILLED})..." 
	    exit 0
	    ;;
	"-r" )
	    [ -z ${PID_TO_BE_KILLED} ] && echo "* There is no instance of ${APP_NAME} running..." && exit 1
	    kill -15 ${PID_TO_BE_KILLED} && echo "* Killing ${APP_NAME}(PID:${PID_TO_BE_KILLED})..." 	
	    start_app
	    exit 0
	    ;;
	* )
	    echo "* Unsupported option..."
	    exit 4
	    ;;
esac 
