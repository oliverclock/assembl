#!/bin/sh
./dev_env.sh exec -u assembl_user supervisord sh -c '. venv/bin/activate && exec fish'