#!/bin/bash

set -eo pipefail

for file in src/components/ui/*.tsx; 
  do npx -y shadcn@latest add -y -o "$(basename "$file" .tsx)" || :;
done