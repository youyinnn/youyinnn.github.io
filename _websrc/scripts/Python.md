## Python

### Pyenv

#### Install and config

1. follow: https://github.com/pyenv/pyenv

2. PATH:

   ``` zsh
   // .zshrc
   
   export PYENV_ROOR="$HOME/.pyenv"
   export PATH=$PYENV_ROOT/shims:$PATH
   eval "$(pyenv init -)"
   eval "$(pyenv virtualenv-init -)"
   ```

   

