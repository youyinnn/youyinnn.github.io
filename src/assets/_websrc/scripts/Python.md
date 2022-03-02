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

#### Cheat sheet

https://kapeli.com/cheat_sheets/Conda.docset/Contents/Resources/Documents/index

##### Managing Conda and Anaconda

| `conda info`            | Verify conda is installed, check version #   |
| ----------------------- | -------------------------------------------- |
| `conda update conda`    | Update conda package and environment manager |
| `conda update anaconda` | Update the anaconda meta package             |

##### Managing Environments

| ` conda info --envs``conda info -e `                                               | Get a list of all my environmentsActive environment shown with `*` |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| ` conda create --name snowflakes biopython``conda create -n snowflakes biopython ` | Create an environment and install program(s)                       |
| `conda activate snowflakes`                                                        | Activate the new environment to use it                             |
| `conda deactivate`                                                                 | Deactivate the environment                                         |
| `conda create -n bunnies python=3.4 astroid`                                       | Create a new environment, specify Python version                   |
| `conda create -n flowers --clone snowflakes`                                       | Make exact copy of an environment                                  |
| `conda remove -n flowers --all`                                                    | Delete an environment                                              |
| `conda env export > puppies.yml`                                                   | Save current environment to a file                                 |
| `conda env create -f puppies.yml`                                                  | Load environment from a file                                       |

##### Managing Python

| ` conda search --full-name python``conda search -f python ` | Check versions of Python available to install          |
| ----------------------------------------------------------- | ------------------------------------------------------ |
| `conda create -n snakes python=3.4`                         | Install different version of Python in new environment |

##### Managing .condarc Configuration

| `conda config --get`                 | Get all keys and values from my .condarc file                            |
| ------------------------------------ | ------------------------------------------------------------------------ |
| `conda config --get channels`        | Get value of the key channels from .condarc file                         |
| `conda config --add channels pandas` | Add a new value to channels so conda looks for packages in this location |

##### Managing Packages, Including Python

| `conda list`                                                   | View list of packages and versions installed in active environment                                                                   |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `conda search beautiful-soup`                                  | Search for a package to see if it is available to conda install                                                                      |
| `conda install -n bunnies beautiful-soup`                      | Install a new package**NOTE:** If you do not include the name of the environment, it will install in the current active environment. |
| `conda update beautiful-soup`                                  | Update a package in the current environment                                                                                          |
| `conda search --override-channels -c pandas bottleneck`        | Search for a package in a specific location (the pandas channel on Anaconda.org)                                                     |
| `conda install -c pandas bottleneck`                           | Install a package from a specific channel                                                                                            |
| `conda search --override-channels -c defaults beautiful-soup`  | Search for a package to see if it is available from the Anaconda repository                                                          |
| `conda install iopro accelerate`                               | Install commercial Continuum packages                                                                                                |
| ` conda skeleton pypi pyinstrument``conda build pyinstrument ` | Build a Conda package from a Python Package Index (PyPi) Package                                                                     |

##### Removing Packages or Environments

| `conda remove --name bunnies beautiful-soup`         | Remove one package from any named environment  |
| ---------------------------------------------------- | ---------------------------------------------- |
| `conda remove beautiful-soup`                        | Remove one package from the active environment |
| `conda remove --name bunnies beautiful-soup astroid` | Remove multiple packages from any environment  |
| `conda remove --name snakes --all`                   | Remove an environment                          |

### Colab & Jupiter

- [Test if notebook is running on Google Colab](https://stackoverflow.com/questions/53581278/test-if-notebook-is-running-on-google-colab)
- [How to Deal With Files in Google Colab: Everything You Need to Know](https://neptune.ai/blog/google-colab-dealing-with-files)

#### iPython

- [Reloading submodules in IPython](https://stackoverflow.com/questions/5364050/reloading-submodules-in-ipython)



### Seaborn

[Python Seaborn Distribution Plots: Rug Plot](https://www.programsbuzz.com/article/python-seaborn-distribution-plots-rug-plot)



### Pandas

[How do I select rows from a DataFrame based on column values?](https://stackoverflow.com/questions/17071871/how-do-i-select-rows-from-a-dataframe-based-on-column-values)

[How to get a column value from a row in a Pandas `DataFrame` in Python](https://www.kite.com/python/answers/how-to-get-a-column-value-from-a-row-in-a-pandas-%60dataframe%60-in-python#:~:text=iloc%20to%20select%20a%20value,specified%20row%20index%20as%20i%20.)

[How to iterate over rows in a DataFrame in Pandas](https://stackoverflow.com/questions/16476924/how-to-iterate-over-rows-in-a-dataframe-in-pandas)

[How do I get the row count of a Pandas DataFrame?](https://stackoverflow.com/questions/15943769/how-do-i-get-the-row-count-of-a-pandas-dataframe)



### Pypolt plt & ax

https://zhuanlan.zhihu.com/p/93423829



### 下载Google Drive文件

You can use [gdown](https://github.com/wkentaro/gdown). Consider also visiting that page for full instructions; this is just a summary and the source repo may have more up-to-date instructions.

------

Install it with the following command:

```
pip install gdown
```

After that, you can download any file from Google Drive by running one of these commands:

```
gdown https://drive.google.com/uc?id=<file_id>  # for files
gdown --id <file_id>                            # alternative format
gdown --folder https://drive.google.com/drive/folders/<file_id>  # for folders
gdown --folder --id <file_id>                   # this format works for folders too
```
