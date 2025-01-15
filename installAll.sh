#!/bin/bash
echo "$(tput setaf 4)拉取代码... $(tput setaf 3)"
git checkout main
git pull
echo "$(tput setaf 4)安装依赖... $(tput setaf 3)"
pnpm install husky && pnpm install
