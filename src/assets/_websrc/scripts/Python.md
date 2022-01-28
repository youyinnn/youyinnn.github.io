## Python

### Pyenv

#### Install and config

1. follow: https://github.com/pyenv/pyenv

2. PATH:

   ```zsh
   // .zshrc

   export PYENV_ROOR="$HOME/.pyenv"
   export PATH=$PYENV_ROOT/shims:$PATH
   eval "$(pyenv init -)"
   eval "$(pyenv virtualenv-init -)"
   ```

##### Tricks

- [Importing files from different folder](https://stackoverflow.com/questions/4383571/importing-files-from-different-folder)
- [python .replace() regex](https://stackoverflow.com/questions/11475885/python-replace-regex)

### Conda

#### Install python 3.7.0 (only available in x86_64)

```bash
conda config --add channels https://repo.anaconda.com/pkgs/main/osx-64/
conda install python=3.7.0
```

### Colab & Jupiter

- [Test if notebook is running on Google Colab](https://stackoverflow.com/questions/53581278/test-if-notebook-is-running-on-google-colab)
- [How to Deal With Files in Google Colab: Everything You Need to Know](https://neptune.ai/blog/google-colab-dealing-with-files)

#### iPython

- [Reloading submodules in IPython](https://stackoverflow.com/questions/5364050/reloading-submodules-in-ipython)
