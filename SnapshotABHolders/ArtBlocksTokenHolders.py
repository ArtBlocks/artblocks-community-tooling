#!/usr/bin/env python3

########################################################################################
## This script provides an easy way to aggregate the token holders of Art Blocks
## projects.
##
## In this current example, all projects are being queried. However, projectIDFilter
## can be changed to query only project "0", Chromie Squiggles [1] by using the 
## example string where it is defined. You must follow the example formatting when 
## filtering for projects. Also, this script and/or graphql queries can be easily 
## altered to achieve many different types of quieres and results.
##
## This data is pulled from the Art Blocks subgraph [2] and required Python 3.4+
## and (optionally, but preferably) virtualenv [3].
##
## High level instructions to use this script:
## 1. Download this file from Github Gist, or copy and paste the contents into a
##    new file named `ArtBlocksTokenHolders.py`. If you download the file, make
##    sure to rename it to `ArtBlocksTokenHolders.py`.
## 2. Ensure that you have Python 3.4+ installed on your system,
##    you can test this by running `python3 --version`
##    from your terminal and ensuring a valid version string is output.
## 3. Ensure that you can navigate to the `ArtBlocksTokenHolders.py` file you
##    downloaded/created via your terminal.
## 4. Make any modifications to the script (to query for a different project,
##    for example) and save.
## 5. Run the script by running the commands in the instructions below from your
##    terminal after having navigated to the directory containing your script
##    (ex. by using the `cd` command in your terminal).
## 6. You should now have a `ArtBlocksTokenHolders.csv` file in the same
##    directory that you ran the script in, which you can open with your favorite
##    text editor or spreadsheet editor.
##
## To run this script do the following (after modifying as desired):
## `$ python3 -m venv ./venv
## `$ source ./venv/bin/activate`
## `$ pip install -r requirements.txt`
## `$ python ArtBlocksTokenHolders.py`
##
## [1] https://artblocks.io/project/0
## [2] https://thegraph.com/explorer/subgraph/artblocks/art-blocks
## [3] https://docs.python.org/3/library/venv.html
########################################################################################

import os
import requests
from requests.exceptions import HTTPError
import csv
import time

RESULTS_CSV = 'ArtBlocksTokenHolders.csv'
# optionally export a CSV containing only a list of unique owners
OWNERS_ONLY_CSV = 'ArtBlocksTokenHolders_OwnersOnly.csv'  # or None
SUBGRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/artblocks/art-blocks'
SUBGRAPH_QUERY= """
{{
  tokens(first: {entries}, where: {{ id_gt: "{lastID}" }}) {{
    id
    owner{{
      id
    }}
    project {{
      id
    }}
  }}
}}
"""
SUBGRAPH_QUERY_PROJECT= """
{{
  tokens(first: {entries}, where: {{ id_gt: "{lastID}", project: "{projectID}" }}) {{
    id
    owner{{
      id
    }}
    project {{
      id
    }}
  }}
}}
"""

def getTokens(session, entries, lastID, projectIDFilter=None):
    print(f'Retrieving next {entries} after item {lastID}.')
    subgraphQuery = SUBGRAPH_QUERY.format(entries=entries, lastID=lastID) \
        if projectIDFilter == None \
        else SUBGRAPH_QUERY_PROJECT.format(entries=entries, lastID=lastID, projectID=projectIDFilter)
    try:
        response = session.post(SUBGRAPH_ENDPOINT, json={'query': subgraphQuery})
        response.raise_for_status()
        return response.json()
    except HTTPError as http_err:
        print(f'HTTP error occurred: {http_err}')
        return None
    except Exception as err:
        print(f'Other error occurred: {err}')
        return None

def main():
    session = requests.Session()
    ownerToProjectsMap = dict()

    entries = 1000
    lastID = ''
    projectIDFilter = None  # e.g. Project 0: '0x059edd72cd353df5106d2b9cc5ab83a52287ac3a-0'
    response = getTokens(session, entries, '', projectIDFilter)
    while response:
        tokens = response["data"]["tokens"]
        if not tokens:
            break

        for token in tokens:
            owner = token["owner"]["id"]
            projectID = token["project"]["id"]

            projects = ownerToProjectsMap.get(owner)
            if projects is None:
                projects = set()
            projects.add(projectID)
            ownerToProjectsMap[owner] = projects

        time.sleep(1)
        lastID = tokens[-1]["id"]
        response = getTokens(session, entries, lastID, projectIDFilter)

    with open(RESULTS_CSV, 'w') as f:
        fieldnames = ['Owner', 'Projects', 'Total Projects Count']
        writer = csv.DictWriter(f, quoting=csv.QUOTE_ALL, fieldnames=fieldnames)
        writer.writeheader()

        for owner, projects in ownerToProjectsMap.items():
            writer.writerow({
                'Owner': owner,
                'Projects': sorted(projects),
                'Total Projects Count': len(projects)
            })
    if OWNERS_ONLY_CSV:
        import pandas as pd
        data = pd.read_csv(RESULTS_CSV)
        data.sort_values("Owner", axis=0, ascending=True,
                 inplace=True, na_position='first')
        dataToWrite = data["Owner"]
        dataToWrite.to_csv(OWNERS_ONLY_CSV, index=False)

if __name__ == "__main__":
    main()
