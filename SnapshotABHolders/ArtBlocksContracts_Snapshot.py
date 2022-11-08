#!/usr/bin/env python3

########################################################################################
## This script provides an easy way to take a snapshot of the token holders of Art Blocks
## hosted projects (typically used for an allowlist). Hosted projects include "Collaborations"
## although these can be removed by subtituting the AB_CORE_CONTRACT_ADDRESSES query.
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

RESULTS_CSV = 'ArtBlocksContracts_Snapshot.csv'
SUBGRAPH_ENDPOINT = 'https://api.thegraph.com/subgraphs/name/artblocks/art-blocks'

AB_CORE_CONTRACT_ADDRESSES = [
  "0x059edd72cd353df5106d2b9cc5ab83a52287ac3a", #GenArt721CoreV0
  "0x99a9b7c1116f9ceeb1652de04d5969cce509b069", #GenArt721CoreV3
  "0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270", #GenArt721CoreV1
  ]
AB_CORE_AND_COLLABORATOR_CONTRACT_ADDRESSES = [
  "\"0x059edd72cd353df5106d2b9cc5ab83a52287ac3a\"", #GenArt721CoreV0
  "\"0x99a9b7c1116f9ceeb1652de04d5969cce509b069\"", #GenArt721CoreV3
  "\"0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270\"", #GenArt721CoreV1
  "\"0x64780ce53f6e966e18a22af13a2f97369580ec11\"" # GenArt721CoreV2_ArtBlocksXPace
  ]

SUBGRAPH_QUERY_AB_AND_COLLAB_PROJECTS= """
{{
  accounts(where: {{ tokens_: {{ contract_in: [{contracts}] }}, id_gt: "{lastID}"}}, orderBy: id, orderDirection: asc, first: 999) {{
    id
  }}
}}
"""

def getTokens(session, entries, lastID, projectIDFilter=None):
    print(f'Retrieving next {entries} after item {lastID}.')

    subgraphQuery = SUBGRAPH_QUERY_AB_AND_COLLAB_PROJECTS.format(entries=entries, lastID=lastID, contracts=str(",".join(AB_CORE_AND_COLLABORATOR_CONTRACT_ADDRESSES))) \
        if projectIDFilter == None \
        else SUBGRAPH_QUERY_AB_AND_COLLAB_PROJECTS.format(entries=entries, lastID=lastID, projectID=projectIDFilter, contracts=str(",".join(AB_CORE_AND_COLLABORATOR_CONTRACT_ADDRESSES)))
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
    allAccounts = []

    entries = 1000
    lastID = ''
    projectIDFilter = None  # e.g. Project 0: '0x059edd72cd353df5106d2b9cc5ab83a52287ac3a-0'
    response = getTokens(session, entries, '', projectIDFilter)

    while response:
        accounts = response["data"]["accounts"]
        if not accounts:
            break

        for account in accounts:
            allAccounts.append(account["id"])

        time.sleep(1)
        lastID = accounts[-1]["id"]
        response = getTokens(session, entries, lastID, projectIDFilter)

    with open(RESULTS_CSV, 'w') as f:
        writer = csv.writer(f)

        for account in allAccounts:
            writer.writerow([account])

if __name__ == "__main__":
    main()
