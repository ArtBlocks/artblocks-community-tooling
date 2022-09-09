import gql from 'graphql-tag';
export type Maybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: string;
  BigInt: string;
  Bytes: string;
};




export type Account = {
  __typename?: 'Account';
  id: Scalars['ID'];
  tokens?: Maybe<Array<Token>>;
  /** Projects the account owns tokens from */
  projectsOwned?: Maybe<Array<AccountProject>>;
  /** Projects the account is listed as artist for */
  projectsCreated?: Maybe<Array<Project>>;
  /** Contracts the account is whitelisted on */
  whitelistedOn?: Maybe<Array<Whitelisting>>;
};


export type AccountTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
};


export type AccountProjectsOwnedArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AccountProject_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AccountProject_Filter>;
};


export type AccountProjectsCreatedArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Project_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Project_Filter>;
};


export type AccountWhitelistedOnArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Whitelisting_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Whitelisting_Filter>;
};

export type AccountProject = {
  __typename?: 'AccountProject';
  id: Scalars['ID'];
  account: Account;
  project: Project;
  count: Scalars['Int'];
};

export type AccountProject_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  account?: Maybe<Scalars['String']>;
  account_not?: Maybe<Scalars['String']>;
  account_gt?: Maybe<Scalars['String']>;
  account_lt?: Maybe<Scalars['String']>;
  account_gte?: Maybe<Scalars['String']>;
  account_lte?: Maybe<Scalars['String']>;
  account_in?: Maybe<Array<Scalars['String']>>;
  account_not_in?: Maybe<Array<Scalars['String']>>;
  account_contains?: Maybe<Scalars['String']>;
  account_contains_nocase?: Maybe<Scalars['String']>;
  account_not_contains?: Maybe<Scalars['String']>;
  account_not_contains_nocase?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_starts_with_nocase?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with_nocase?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_ends_with_nocase?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with_nocase?: Maybe<Scalars['String']>;
  account_?: Maybe<Account_Filter>;
  project?: Maybe<Scalars['String']>;
  project_not?: Maybe<Scalars['String']>;
  project_gt?: Maybe<Scalars['String']>;
  project_lt?: Maybe<Scalars['String']>;
  project_gte?: Maybe<Scalars['String']>;
  project_lte?: Maybe<Scalars['String']>;
  project_in?: Maybe<Array<Scalars['String']>>;
  project_not_in?: Maybe<Array<Scalars['String']>>;
  project_contains?: Maybe<Scalars['String']>;
  project_contains_nocase?: Maybe<Scalars['String']>;
  project_not_contains?: Maybe<Scalars['String']>;
  project_not_contains_nocase?: Maybe<Scalars['String']>;
  project_starts_with?: Maybe<Scalars['String']>;
  project_starts_with_nocase?: Maybe<Scalars['String']>;
  project_not_starts_with?: Maybe<Scalars['String']>;
  project_not_starts_with_nocase?: Maybe<Scalars['String']>;
  project_ends_with?: Maybe<Scalars['String']>;
  project_ends_with_nocase?: Maybe<Scalars['String']>;
  project_not_ends_with?: Maybe<Scalars['String']>;
  project_not_ends_with_nocase?: Maybe<Scalars['String']>;
  project_?: Maybe<Project_Filter>;
  count?: Maybe<Scalars['Int']>;
  count_not?: Maybe<Scalars['Int']>;
  count_gt?: Maybe<Scalars['Int']>;
  count_lt?: Maybe<Scalars['Int']>;
  count_gte?: Maybe<Scalars['Int']>;
  count_lte?: Maybe<Scalars['Int']>;
  count_in?: Maybe<Array<Scalars['Int']>>;
  count_not_in?: Maybe<Array<Scalars['Int']>>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum AccountProject_OrderBy {
  Id = 'id',
  Account = 'account',
  Project = 'project',
  Count = 'count'
}

export type Account_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  tokens_?: Maybe<Token_Filter>;
  projectsOwned_?: Maybe<AccountProject_Filter>;
  projectsCreated_?: Maybe<Project_Filter>;
  whitelistedOn_?: Maybe<Whitelisting_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Account_OrderBy {
  Id = 'id',
  Tokens = 'tokens',
  ProjectsOwned = 'projectsOwned',
  ProjectsCreated = 'projectsCreated',
  WhitelistedOn = 'whitelistedOn'
}



export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
  number_gte?: Maybe<Scalars['Int']>;
};


export type Contract = {
  __typename?: 'Contract';
  id: Scalars['ID'];
  admin: Scalars['Bytes'];
  /** Address that receives platform fees */
  renderProviderAddress: Scalars['Bytes'];
  /** Percentage of sales the platform takes */
  renderProviderPercentage: Scalars['BigInt'];
  /** List of contracts that are allowed to mint */
  mintWhitelisted: Array<Scalars['Bytes']>;
  /** Randomizer contract used to generate token hashes */
  randomizerContract?: Maybe<Scalars['Bytes']>;
  nextProjectId: Scalars['BigInt'];
  /** List of projects on the contract */
  projects?: Maybe<Array<Project>>;
  /** List of tokens on the contract */
  tokens?: Maybe<Array<Token>>;
  /** Accounts whitelisted on the contract */
  whitelisted?: Maybe<Array<Whitelisting>>;
  createdAt: Scalars['BigInt'];
  updatedAt: Scalars['BigInt'];
  /** Associated minter filter (if applicable) */
  minterFilter?: Maybe<MinterFilter>;
};


export type ContractProjectsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Project_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Project_Filter>;
};


export type ContractTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
};


export type ContractWhitelistedArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Whitelisting_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Whitelisting_Filter>;
};

export type Contract_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  admin?: Maybe<Scalars['Bytes']>;
  admin_not?: Maybe<Scalars['Bytes']>;
  admin_in?: Maybe<Array<Scalars['Bytes']>>;
  admin_not_in?: Maybe<Array<Scalars['Bytes']>>;
  admin_contains?: Maybe<Scalars['Bytes']>;
  admin_not_contains?: Maybe<Scalars['Bytes']>;
  renderProviderAddress?: Maybe<Scalars['Bytes']>;
  renderProviderAddress_not?: Maybe<Scalars['Bytes']>;
  renderProviderAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  renderProviderAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  renderProviderAddress_contains?: Maybe<Scalars['Bytes']>;
  renderProviderAddress_not_contains?: Maybe<Scalars['Bytes']>;
  renderProviderPercentage?: Maybe<Scalars['BigInt']>;
  renderProviderPercentage_not?: Maybe<Scalars['BigInt']>;
  renderProviderPercentage_gt?: Maybe<Scalars['BigInt']>;
  renderProviderPercentage_lt?: Maybe<Scalars['BigInt']>;
  renderProviderPercentage_gte?: Maybe<Scalars['BigInt']>;
  renderProviderPercentage_lte?: Maybe<Scalars['BigInt']>;
  renderProviderPercentage_in?: Maybe<Array<Scalars['BigInt']>>;
  renderProviderPercentage_not_in?: Maybe<Array<Scalars['BigInt']>>;
  mintWhitelisted?: Maybe<Array<Scalars['Bytes']>>;
  mintWhitelisted_not?: Maybe<Array<Scalars['Bytes']>>;
  mintWhitelisted_contains?: Maybe<Array<Scalars['Bytes']>>;
  mintWhitelisted_contains_nocase?: Maybe<Array<Scalars['Bytes']>>;
  mintWhitelisted_not_contains?: Maybe<Array<Scalars['Bytes']>>;
  mintWhitelisted_not_contains_nocase?: Maybe<Array<Scalars['Bytes']>>;
  randomizerContract?: Maybe<Scalars['Bytes']>;
  randomizerContract_not?: Maybe<Scalars['Bytes']>;
  randomizerContract_in?: Maybe<Array<Scalars['Bytes']>>;
  randomizerContract_not_in?: Maybe<Array<Scalars['Bytes']>>;
  randomizerContract_contains?: Maybe<Scalars['Bytes']>;
  randomizerContract_not_contains?: Maybe<Scalars['Bytes']>;
  nextProjectId?: Maybe<Scalars['BigInt']>;
  nextProjectId_not?: Maybe<Scalars['BigInt']>;
  nextProjectId_gt?: Maybe<Scalars['BigInt']>;
  nextProjectId_lt?: Maybe<Scalars['BigInt']>;
  nextProjectId_gte?: Maybe<Scalars['BigInt']>;
  nextProjectId_lte?: Maybe<Scalars['BigInt']>;
  nextProjectId_in?: Maybe<Array<Scalars['BigInt']>>;
  nextProjectId_not_in?: Maybe<Array<Scalars['BigInt']>>;
  projects_?: Maybe<Project_Filter>;
  tokens_?: Maybe<Token_Filter>;
  whitelisted_?: Maybe<Whitelisting_Filter>;
  createdAt?: Maybe<Scalars['BigInt']>;
  createdAt_not?: Maybe<Scalars['BigInt']>;
  createdAt_gt?: Maybe<Scalars['BigInt']>;
  createdAt_lt?: Maybe<Scalars['BigInt']>;
  createdAt_gte?: Maybe<Scalars['BigInt']>;
  createdAt_lte?: Maybe<Scalars['BigInt']>;
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  updatedAt?: Maybe<Scalars['BigInt']>;
  updatedAt_not?: Maybe<Scalars['BigInt']>;
  updatedAt_gt?: Maybe<Scalars['BigInt']>;
  updatedAt_lt?: Maybe<Scalars['BigInt']>;
  updatedAt_gte?: Maybe<Scalars['BigInt']>;
  updatedAt_lte?: Maybe<Scalars['BigInt']>;
  updatedAt_in?: Maybe<Array<Scalars['BigInt']>>;
  updatedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  minterFilter?: Maybe<Scalars['String']>;
  minterFilter_not?: Maybe<Scalars['String']>;
  minterFilter_gt?: Maybe<Scalars['String']>;
  minterFilter_lt?: Maybe<Scalars['String']>;
  minterFilter_gte?: Maybe<Scalars['String']>;
  minterFilter_lte?: Maybe<Scalars['String']>;
  minterFilter_in?: Maybe<Array<Scalars['String']>>;
  minterFilter_not_in?: Maybe<Array<Scalars['String']>>;
  minterFilter_contains?: Maybe<Scalars['String']>;
  minterFilter_contains_nocase?: Maybe<Scalars['String']>;
  minterFilter_not_contains?: Maybe<Scalars['String']>;
  minterFilter_not_contains_nocase?: Maybe<Scalars['String']>;
  minterFilter_starts_with?: Maybe<Scalars['String']>;
  minterFilter_starts_with_nocase?: Maybe<Scalars['String']>;
  minterFilter_not_starts_with?: Maybe<Scalars['String']>;
  minterFilter_not_starts_with_nocase?: Maybe<Scalars['String']>;
  minterFilter_ends_with?: Maybe<Scalars['String']>;
  minterFilter_ends_with_nocase?: Maybe<Scalars['String']>;
  minterFilter_not_ends_with?: Maybe<Scalars['String']>;
  minterFilter_not_ends_with_nocase?: Maybe<Scalars['String']>;
  minterFilter_?: Maybe<MinterFilter_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Contract_OrderBy {
  Id = 'id',
  Admin = 'admin',
  RenderProviderAddress = 'renderProviderAddress',
  RenderProviderPercentage = 'renderProviderPercentage',
  MintWhitelisted = 'mintWhitelisted',
  RandomizerContract = 'randomizerContract',
  NextProjectId = 'nextProjectId',
  Projects = 'projects',
  Tokens = 'tokens',
  Whitelisted = 'whitelisted',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
  MinterFilter = 'minterFilter'
}

export enum Exchange {
  /** Opensea V1 */
  OsV1 = 'OS_V1',
  /** Opensea V2 */
  OsV2 = 'OS_V2',
  /** LooksRare */
  LrV1 = 'LR_V1'
}

export type Minter = {
  __typename?: 'Minter';
  /** Unique identifier made up of minter contract address */
  id: Scalars['ID'];
  /** Minter type */
  type: MinterType;
  /** Associated Minter Filter */
  minterFilter: MinterFilter;
  /** Minimum allowed auction length in seconds (linear Dutch auction minters) */
  minimumAuctionLengthInSeconds?: Maybe<Scalars['BigInt']>;
  /** Minimum allowed half life in seconds (exponential Dutch auction minters) */
  minimumHalfLifeInSeconds?: Maybe<Scalars['BigInt']>;
  /** Maximum allowed half life in seconds (exponential Dutch auction minters) */
  maximumHalfLifeInSeconds?: Maybe<Scalars['BigInt']>;
  coreContract: Contract;
  updatedAt: Scalars['BigInt'];
};

export type MinterFilter = {
  __typename?: 'MinterFilter';
  /** Unique identifier made up of minter filter contract address */
  id: Scalars['ID'];
  /** Associated core contract */
  coreContract: Contract;
  /** Minters allowlisted on MinterFilter */
  minterAllowlist: Array<Minter>;
  updatedAt: Scalars['BigInt'];
};


export type MinterFilterMinterAllowlistArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Minter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Minter_Filter>;
};

export type MinterFilter_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  coreContract?: Maybe<Scalars['String']>;
  coreContract_not?: Maybe<Scalars['String']>;
  coreContract_gt?: Maybe<Scalars['String']>;
  coreContract_lt?: Maybe<Scalars['String']>;
  coreContract_gte?: Maybe<Scalars['String']>;
  coreContract_lte?: Maybe<Scalars['String']>;
  coreContract_in?: Maybe<Array<Scalars['String']>>;
  coreContract_not_in?: Maybe<Array<Scalars['String']>>;
  coreContract_contains?: Maybe<Scalars['String']>;
  coreContract_contains_nocase?: Maybe<Scalars['String']>;
  coreContract_not_contains?: Maybe<Scalars['String']>;
  coreContract_not_contains_nocase?: Maybe<Scalars['String']>;
  coreContract_starts_with?: Maybe<Scalars['String']>;
  coreContract_starts_with_nocase?: Maybe<Scalars['String']>;
  coreContract_not_starts_with?: Maybe<Scalars['String']>;
  coreContract_not_starts_with_nocase?: Maybe<Scalars['String']>;
  coreContract_ends_with?: Maybe<Scalars['String']>;
  coreContract_ends_with_nocase?: Maybe<Scalars['String']>;
  coreContract_not_ends_with?: Maybe<Scalars['String']>;
  coreContract_not_ends_with_nocase?: Maybe<Scalars['String']>;
  coreContract_?: Maybe<Contract_Filter>;
  minterAllowlist_?: Maybe<Minter_Filter>;
  updatedAt?: Maybe<Scalars['BigInt']>;
  updatedAt_not?: Maybe<Scalars['BigInt']>;
  updatedAt_gt?: Maybe<Scalars['BigInt']>;
  updatedAt_lt?: Maybe<Scalars['BigInt']>;
  updatedAt_gte?: Maybe<Scalars['BigInt']>;
  updatedAt_lte?: Maybe<Scalars['BigInt']>;
  updatedAt_in?: Maybe<Array<Scalars['BigInt']>>;
  updatedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum MinterFilter_OrderBy {
  Id = 'id',
  CoreContract = 'coreContract',
  MinterAllowlist = 'minterAllowlist',
  UpdatedAt = 'updatedAt'
}

export enum MinterType {
  MinterSetPriceV0 = 'MinterSetPriceV0',
  MinterSetPriceErc20V0 = 'MinterSetPriceERC20V0',
  MinterDaLinV0 = 'MinterDALinV0',
  MinterDaExpV0 = 'MinterDAExpV0',
  MinterSetPriceV1 = 'MinterSetPriceV1',
  MinterSetPriceErc20V1 = 'MinterSetPriceERC20V1',
  MinterDaLinV1 = 'MinterDALinV1',
  MinterDaExpV1 = 'MinterDAExpV1'
}

export type Minter_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  type?: Maybe<MinterType>;
  type_not?: Maybe<MinterType>;
  type_in?: Maybe<Array<MinterType>>;
  type_not_in?: Maybe<Array<MinterType>>;
  minterFilter?: Maybe<Scalars['String']>;
  minterFilter_not?: Maybe<Scalars['String']>;
  minterFilter_gt?: Maybe<Scalars['String']>;
  minterFilter_lt?: Maybe<Scalars['String']>;
  minterFilter_gte?: Maybe<Scalars['String']>;
  minterFilter_lte?: Maybe<Scalars['String']>;
  minterFilter_in?: Maybe<Array<Scalars['String']>>;
  minterFilter_not_in?: Maybe<Array<Scalars['String']>>;
  minterFilter_contains?: Maybe<Scalars['String']>;
  minterFilter_contains_nocase?: Maybe<Scalars['String']>;
  minterFilter_not_contains?: Maybe<Scalars['String']>;
  minterFilter_not_contains_nocase?: Maybe<Scalars['String']>;
  minterFilter_starts_with?: Maybe<Scalars['String']>;
  minterFilter_starts_with_nocase?: Maybe<Scalars['String']>;
  minterFilter_not_starts_with?: Maybe<Scalars['String']>;
  minterFilter_not_starts_with_nocase?: Maybe<Scalars['String']>;
  minterFilter_ends_with?: Maybe<Scalars['String']>;
  minterFilter_ends_with_nocase?: Maybe<Scalars['String']>;
  minterFilter_not_ends_with?: Maybe<Scalars['String']>;
  minterFilter_not_ends_with_nocase?: Maybe<Scalars['String']>;
  minterFilter_?: Maybe<MinterFilter_Filter>;
  minimumAuctionLengthInSeconds?: Maybe<Scalars['BigInt']>;
  minimumAuctionLengthInSeconds_not?: Maybe<Scalars['BigInt']>;
  minimumAuctionLengthInSeconds_gt?: Maybe<Scalars['BigInt']>;
  minimumAuctionLengthInSeconds_lt?: Maybe<Scalars['BigInt']>;
  minimumAuctionLengthInSeconds_gte?: Maybe<Scalars['BigInt']>;
  minimumAuctionLengthInSeconds_lte?: Maybe<Scalars['BigInt']>;
  minimumAuctionLengthInSeconds_in?: Maybe<Array<Scalars['BigInt']>>;
  minimumAuctionLengthInSeconds_not_in?: Maybe<Array<Scalars['BigInt']>>;
  minimumHalfLifeInSeconds?: Maybe<Scalars['BigInt']>;
  minimumHalfLifeInSeconds_not?: Maybe<Scalars['BigInt']>;
  minimumHalfLifeInSeconds_gt?: Maybe<Scalars['BigInt']>;
  minimumHalfLifeInSeconds_lt?: Maybe<Scalars['BigInt']>;
  minimumHalfLifeInSeconds_gte?: Maybe<Scalars['BigInt']>;
  minimumHalfLifeInSeconds_lte?: Maybe<Scalars['BigInt']>;
  minimumHalfLifeInSeconds_in?: Maybe<Array<Scalars['BigInt']>>;
  minimumHalfLifeInSeconds_not_in?: Maybe<Array<Scalars['BigInt']>>;
  maximumHalfLifeInSeconds?: Maybe<Scalars['BigInt']>;
  maximumHalfLifeInSeconds_not?: Maybe<Scalars['BigInt']>;
  maximumHalfLifeInSeconds_gt?: Maybe<Scalars['BigInt']>;
  maximumHalfLifeInSeconds_lt?: Maybe<Scalars['BigInt']>;
  maximumHalfLifeInSeconds_gte?: Maybe<Scalars['BigInt']>;
  maximumHalfLifeInSeconds_lte?: Maybe<Scalars['BigInt']>;
  maximumHalfLifeInSeconds_in?: Maybe<Array<Scalars['BigInt']>>;
  maximumHalfLifeInSeconds_not_in?: Maybe<Array<Scalars['BigInt']>>;
  coreContract?: Maybe<Scalars['String']>;
  coreContract_not?: Maybe<Scalars['String']>;
  coreContract_gt?: Maybe<Scalars['String']>;
  coreContract_lt?: Maybe<Scalars['String']>;
  coreContract_gte?: Maybe<Scalars['String']>;
  coreContract_lte?: Maybe<Scalars['String']>;
  coreContract_in?: Maybe<Array<Scalars['String']>>;
  coreContract_not_in?: Maybe<Array<Scalars['String']>>;
  coreContract_contains?: Maybe<Scalars['String']>;
  coreContract_contains_nocase?: Maybe<Scalars['String']>;
  coreContract_not_contains?: Maybe<Scalars['String']>;
  coreContract_not_contains_nocase?: Maybe<Scalars['String']>;
  coreContract_starts_with?: Maybe<Scalars['String']>;
  coreContract_starts_with_nocase?: Maybe<Scalars['String']>;
  coreContract_not_starts_with?: Maybe<Scalars['String']>;
  coreContract_not_starts_with_nocase?: Maybe<Scalars['String']>;
  coreContract_ends_with?: Maybe<Scalars['String']>;
  coreContract_ends_with_nocase?: Maybe<Scalars['String']>;
  coreContract_not_ends_with?: Maybe<Scalars['String']>;
  coreContract_not_ends_with_nocase?: Maybe<Scalars['String']>;
  coreContract_?: Maybe<Contract_Filter>;
  updatedAt?: Maybe<Scalars['BigInt']>;
  updatedAt_not?: Maybe<Scalars['BigInt']>;
  updatedAt_gt?: Maybe<Scalars['BigInt']>;
  updatedAt_lt?: Maybe<Scalars['BigInt']>;
  updatedAt_gte?: Maybe<Scalars['BigInt']>;
  updatedAt_lte?: Maybe<Scalars['BigInt']>;
  updatedAt_in?: Maybe<Array<Scalars['BigInt']>>;
  updatedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Minter_OrderBy {
  Id = 'id',
  Type = 'type',
  MinterFilter = 'minterFilter',
  MinimumAuctionLengthInSeconds = 'minimumAuctionLengthInSeconds',
  MinimumHalfLifeInSeconds = 'minimumHalfLifeInSeconds',
  MaximumHalfLifeInSeconds = 'maximumHalfLifeInSeconds',
  CoreContract = 'coreContract',
  UpdatedAt = 'updatedAt'
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Project = {
  __typename?: 'Project';
  /** Unique identifier made up of contract address and project id */
  id: Scalars['ID'];
  /** ID of the project on the contract */
  projectId: Scalars['BigInt'];
  /** Determines if the project should be visible to the public */
  active: Scalars['Boolean'];
  /** Address to split sales with the artist */
  additionalPayee?: Maybe<Scalars['Bytes']>;
  /** Percentage of sales that goes to additional payee */
  additionalPayeePercentage?: Maybe<Scalars['BigInt']>;
  /** Artist that created the project */
  artist: Account;
  /** Wallet address of the artist */
  artistAddress: Scalars['Bytes'];
  /** Artist name */
  artistName?: Maybe<Scalars['String']>;
  baseIpfsUri?: Maybe<Scalars['String']>;
  baseUri?: Maybe<Scalars['String']>;
  /** A project is complete when it has reached its maximum invocations */
  complete: Scalars['Boolean'];
  /** Curated, playground, factory. A project with no curation status is considered factory */
  curationStatus?: Maybe<Scalars['String']>;
  /** ERC-20 contract address if the project is purchasable via ERC-20 */
  currencyAddress?: Maybe<Scalars['Bytes']>;
  /** Currency symbol for ERC-20 */
  currencySymbol?: Maybe<Scalars['String']>;
  /** Artist description of the project */
  description?: Maybe<Scalars['String']>;
  /** Is the project dynamic or a static image */
  dynamic: Scalars['Boolean'];
  /** Number of times the project has been invoked - number of tokens of the project */
  invocations: Scalars['BigInt'];
  ipfsHash?: Maybe<Scalars['String']>;
  /** License for the project */
  license?: Maybe<Scalars['String']>;
  /** Once the project is locked its script may never be updated again */
  locked: Scalars['Boolean'];
  /** Maximum number of invocations allowed for the project */
  maxInvocations: Scalars['BigInt'];
  /** Project name */
  name?: Maybe<Scalars['String']>;
  /** Purchases paused */
  paused: Scalars['Boolean'];
  pricePerTokenInWei: Scalars['BigInt'];
  /** Artist/additional payee royalty percentage */
  royaltyPercentage?: Maybe<Scalars['BigInt']>;
  /** The full script composed of scripts */
  script?: Maybe<Scalars['String']>;
  /** Parts of the project script */
  scripts?: Maybe<Array<ProjectScript>>;
  /** The number of scripts stored on-chain */
  scriptCount: Scalars['BigInt'];
  /** Extra information about the script and rendering options */
  scriptJSON?: Maybe<Scalars['String']>;
  /** Tokens of the project */
  tokens?: Maybe<Array<Token>>;
  /** Does the project actually use the hash string */
  useHashString: Scalars['Boolean'];
  /** Does the project use media from ipfs */
  useIpfs?: Maybe<Scalars['Boolean']>;
  /** Artist or project website */
  website?: Maybe<Scalars['String']>;
  /** Accounts that own tokens of the project */
  owners?: Maybe<Array<AccountProject>>;
  createdAt: Scalars['BigInt'];
  updatedAt: Scalars['BigInt'];
  activatedAt?: Maybe<Scalars['BigInt']>;
  scriptUpdatedAt?: Maybe<Scalars['BigInt']>;
  contract: Contract;
  /** Minter configuration for this project (not implemented prior to minter filters) */
  minterConfiguration?: Maybe<ProjectMinterConfiguration>;
  /** Lookup table to get the Sale history of the project */
  saleLookupTables: Array<SaleLookupTable>;
};


export type ProjectScriptsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ProjectScript_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<ProjectScript_Filter>;
};


export type ProjectTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
};


export type ProjectOwnersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AccountProject_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AccountProject_Filter>;
};


export type ProjectSaleLookupTablesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SaleLookupTable_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SaleLookupTable_Filter>;
};

export type ProjectMinterConfiguration = {
  __typename?: 'ProjectMinterConfiguration';
  /** Unique identifier made up of minter contract address-projectId */
  id: Scalars['ID'];
  /** The associated project */
  project: Project;
  /** The associated minter */
  minter: Minter;
  /** true if project's token price has been configured on minter */
  priceIsConfigured: Scalars['Boolean'];
  /** currency symbol as defined on minter - ETH reserved for ether */
  currencySymbol: Scalars['String'];
  /** currency address as defined on minter - address(0) reserved for ether */
  currencyAddress: Scalars['Bytes'];
  /** Defines if purchasing token to another is allowed */
  purchaseToDisabled: Scalars['Boolean'];
  /** price of token or resting price of Duch auction, in wei */
  basePrice?: Maybe<Scalars['BigInt']>;
  /** Dutch auction start price, in wei */
  startPrice?: Maybe<Scalars['BigInt']>;
  /** Half life for exponential decay Dutch auction, in seconds */
  halfLifeSeconds?: Maybe<Scalars['BigInt']>;
  /** Dutch auction start time (unix timestamp) */
  startTime?: Maybe<Scalars['BigInt']>;
  /** Linear Dutch auction end time (unix timestamp) */
  endTime?: Maybe<Scalars['BigInt']>;
};

export type ProjectMinterConfiguration_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  project?: Maybe<Scalars['String']>;
  project_not?: Maybe<Scalars['String']>;
  project_gt?: Maybe<Scalars['String']>;
  project_lt?: Maybe<Scalars['String']>;
  project_gte?: Maybe<Scalars['String']>;
  project_lte?: Maybe<Scalars['String']>;
  project_in?: Maybe<Array<Scalars['String']>>;
  project_not_in?: Maybe<Array<Scalars['String']>>;
  project_contains?: Maybe<Scalars['String']>;
  project_contains_nocase?: Maybe<Scalars['String']>;
  project_not_contains?: Maybe<Scalars['String']>;
  project_not_contains_nocase?: Maybe<Scalars['String']>;
  project_starts_with?: Maybe<Scalars['String']>;
  project_starts_with_nocase?: Maybe<Scalars['String']>;
  project_not_starts_with?: Maybe<Scalars['String']>;
  project_not_starts_with_nocase?: Maybe<Scalars['String']>;
  project_ends_with?: Maybe<Scalars['String']>;
  project_ends_with_nocase?: Maybe<Scalars['String']>;
  project_not_ends_with?: Maybe<Scalars['String']>;
  project_not_ends_with_nocase?: Maybe<Scalars['String']>;
  project_?: Maybe<Project_Filter>;
  minter?: Maybe<Scalars['String']>;
  minter_not?: Maybe<Scalars['String']>;
  minter_gt?: Maybe<Scalars['String']>;
  minter_lt?: Maybe<Scalars['String']>;
  minter_gte?: Maybe<Scalars['String']>;
  minter_lte?: Maybe<Scalars['String']>;
  minter_in?: Maybe<Array<Scalars['String']>>;
  minter_not_in?: Maybe<Array<Scalars['String']>>;
  minter_contains?: Maybe<Scalars['String']>;
  minter_contains_nocase?: Maybe<Scalars['String']>;
  minter_not_contains?: Maybe<Scalars['String']>;
  minter_not_contains_nocase?: Maybe<Scalars['String']>;
  minter_starts_with?: Maybe<Scalars['String']>;
  minter_starts_with_nocase?: Maybe<Scalars['String']>;
  minter_not_starts_with?: Maybe<Scalars['String']>;
  minter_not_starts_with_nocase?: Maybe<Scalars['String']>;
  minter_ends_with?: Maybe<Scalars['String']>;
  minter_ends_with_nocase?: Maybe<Scalars['String']>;
  minter_not_ends_with?: Maybe<Scalars['String']>;
  minter_not_ends_with_nocase?: Maybe<Scalars['String']>;
  minter_?: Maybe<Minter_Filter>;
  priceIsConfigured?: Maybe<Scalars['Boolean']>;
  priceIsConfigured_not?: Maybe<Scalars['Boolean']>;
  priceIsConfigured_in?: Maybe<Array<Scalars['Boolean']>>;
  priceIsConfigured_not_in?: Maybe<Array<Scalars['Boolean']>>;
  currencySymbol?: Maybe<Scalars['String']>;
  currencySymbol_not?: Maybe<Scalars['String']>;
  currencySymbol_gt?: Maybe<Scalars['String']>;
  currencySymbol_lt?: Maybe<Scalars['String']>;
  currencySymbol_gte?: Maybe<Scalars['String']>;
  currencySymbol_lte?: Maybe<Scalars['String']>;
  currencySymbol_in?: Maybe<Array<Scalars['String']>>;
  currencySymbol_not_in?: Maybe<Array<Scalars['String']>>;
  currencySymbol_contains?: Maybe<Scalars['String']>;
  currencySymbol_contains_nocase?: Maybe<Scalars['String']>;
  currencySymbol_not_contains?: Maybe<Scalars['String']>;
  currencySymbol_not_contains_nocase?: Maybe<Scalars['String']>;
  currencySymbol_starts_with?: Maybe<Scalars['String']>;
  currencySymbol_starts_with_nocase?: Maybe<Scalars['String']>;
  currencySymbol_not_starts_with?: Maybe<Scalars['String']>;
  currencySymbol_not_starts_with_nocase?: Maybe<Scalars['String']>;
  currencySymbol_ends_with?: Maybe<Scalars['String']>;
  currencySymbol_ends_with_nocase?: Maybe<Scalars['String']>;
  currencySymbol_not_ends_with?: Maybe<Scalars['String']>;
  currencySymbol_not_ends_with_nocase?: Maybe<Scalars['String']>;
  currencyAddress?: Maybe<Scalars['Bytes']>;
  currencyAddress_not?: Maybe<Scalars['Bytes']>;
  currencyAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  currencyAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  currencyAddress_contains?: Maybe<Scalars['Bytes']>;
  currencyAddress_not_contains?: Maybe<Scalars['Bytes']>;
  purchaseToDisabled?: Maybe<Scalars['Boolean']>;
  purchaseToDisabled_not?: Maybe<Scalars['Boolean']>;
  purchaseToDisabled_in?: Maybe<Array<Scalars['Boolean']>>;
  purchaseToDisabled_not_in?: Maybe<Array<Scalars['Boolean']>>;
  basePrice?: Maybe<Scalars['BigInt']>;
  basePrice_not?: Maybe<Scalars['BigInt']>;
  basePrice_gt?: Maybe<Scalars['BigInt']>;
  basePrice_lt?: Maybe<Scalars['BigInt']>;
  basePrice_gte?: Maybe<Scalars['BigInt']>;
  basePrice_lte?: Maybe<Scalars['BigInt']>;
  basePrice_in?: Maybe<Array<Scalars['BigInt']>>;
  basePrice_not_in?: Maybe<Array<Scalars['BigInt']>>;
  startPrice?: Maybe<Scalars['BigInt']>;
  startPrice_not?: Maybe<Scalars['BigInt']>;
  startPrice_gt?: Maybe<Scalars['BigInt']>;
  startPrice_lt?: Maybe<Scalars['BigInt']>;
  startPrice_gte?: Maybe<Scalars['BigInt']>;
  startPrice_lte?: Maybe<Scalars['BigInt']>;
  startPrice_in?: Maybe<Array<Scalars['BigInt']>>;
  startPrice_not_in?: Maybe<Array<Scalars['BigInt']>>;
  halfLifeSeconds?: Maybe<Scalars['BigInt']>;
  halfLifeSeconds_not?: Maybe<Scalars['BigInt']>;
  halfLifeSeconds_gt?: Maybe<Scalars['BigInt']>;
  halfLifeSeconds_lt?: Maybe<Scalars['BigInt']>;
  halfLifeSeconds_gte?: Maybe<Scalars['BigInt']>;
  halfLifeSeconds_lte?: Maybe<Scalars['BigInt']>;
  halfLifeSeconds_in?: Maybe<Array<Scalars['BigInt']>>;
  halfLifeSeconds_not_in?: Maybe<Array<Scalars['BigInt']>>;
  startTime?: Maybe<Scalars['BigInt']>;
  startTime_not?: Maybe<Scalars['BigInt']>;
  startTime_gt?: Maybe<Scalars['BigInt']>;
  startTime_lt?: Maybe<Scalars['BigInt']>;
  startTime_gte?: Maybe<Scalars['BigInt']>;
  startTime_lte?: Maybe<Scalars['BigInt']>;
  startTime_in?: Maybe<Array<Scalars['BigInt']>>;
  startTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  endTime?: Maybe<Scalars['BigInt']>;
  endTime_not?: Maybe<Scalars['BigInt']>;
  endTime_gt?: Maybe<Scalars['BigInt']>;
  endTime_lt?: Maybe<Scalars['BigInt']>;
  endTime_gte?: Maybe<Scalars['BigInt']>;
  endTime_lte?: Maybe<Scalars['BigInt']>;
  endTime_in?: Maybe<Array<Scalars['BigInt']>>;
  endTime_not_in?: Maybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum ProjectMinterConfiguration_OrderBy {
  Id = 'id',
  Project = 'project',
  Minter = 'minter',
  PriceIsConfigured = 'priceIsConfigured',
  CurrencySymbol = 'currencySymbol',
  CurrencyAddress = 'currencyAddress',
  PurchaseToDisabled = 'purchaseToDisabled',
  BasePrice = 'basePrice',
  StartPrice = 'startPrice',
  HalfLifeSeconds = 'halfLifeSeconds',
  StartTime = 'startTime',
  EndTime = 'endTime'
}

export type ProjectScript = {
  __typename?: 'ProjectScript';
  id: Scalars['ID'];
  index: Scalars['BigInt'];
  project: Project;
  script: Scalars['String'];
};

export type ProjectScript_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  index?: Maybe<Scalars['BigInt']>;
  index_not?: Maybe<Scalars['BigInt']>;
  index_gt?: Maybe<Scalars['BigInt']>;
  index_lt?: Maybe<Scalars['BigInt']>;
  index_gte?: Maybe<Scalars['BigInt']>;
  index_lte?: Maybe<Scalars['BigInt']>;
  index_in?: Maybe<Array<Scalars['BigInt']>>;
  index_not_in?: Maybe<Array<Scalars['BigInt']>>;
  project?: Maybe<Scalars['String']>;
  project_not?: Maybe<Scalars['String']>;
  project_gt?: Maybe<Scalars['String']>;
  project_lt?: Maybe<Scalars['String']>;
  project_gte?: Maybe<Scalars['String']>;
  project_lte?: Maybe<Scalars['String']>;
  project_in?: Maybe<Array<Scalars['String']>>;
  project_not_in?: Maybe<Array<Scalars['String']>>;
  project_contains?: Maybe<Scalars['String']>;
  project_contains_nocase?: Maybe<Scalars['String']>;
  project_not_contains?: Maybe<Scalars['String']>;
  project_not_contains_nocase?: Maybe<Scalars['String']>;
  project_starts_with?: Maybe<Scalars['String']>;
  project_starts_with_nocase?: Maybe<Scalars['String']>;
  project_not_starts_with?: Maybe<Scalars['String']>;
  project_not_starts_with_nocase?: Maybe<Scalars['String']>;
  project_ends_with?: Maybe<Scalars['String']>;
  project_ends_with_nocase?: Maybe<Scalars['String']>;
  project_not_ends_with?: Maybe<Scalars['String']>;
  project_not_ends_with_nocase?: Maybe<Scalars['String']>;
  project_?: Maybe<Project_Filter>;
  script?: Maybe<Scalars['String']>;
  script_not?: Maybe<Scalars['String']>;
  script_gt?: Maybe<Scalars['String']>;
  script_lt?: Maybe<Scalars['String']>;
  script_gte?: Maybe<Scalars['String']>;
  script_lte?: Maybe<Scalars['String']>;
  script_in?: Maybe<Array<Scalars['String']>>;
  script_not_in?: Maybe<Array<Scalars['String']>>;
  script_contains?: Maybe<Scalars['String']>;
  script_contains_nocase?: Maybe<Scalars['String']>;
  script_not_contains?: Maybe<Scalars['String']>;
  script_not_contains_nocase?: Maybe<Scalars['String']>;
  script_starts_with?: Maybe<Scalars['String']>;
  script_starts_with_nocase?: Maybe<Scalars['String']>;
  script_not_starts_with?: Maybe<Scalars['String']>;
  script_not_starts_with_nocase?: Maybe<Scalars['String']>;
  script_ends_with?: Maybe<Scalars['String']>;
  script_ends_with_nocase?: Maybe<Scalars['String']>;
  script_not_ends_with?: Maybe<Scalars['String']>;
  script_not_ends_with_nocase?: Maybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum ProjectScript_OrderBy {
  Id = 'id',
  Index = 'index',
  Project = 'project',
  Script = 'script'
}

export type Project_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  projectId?: Maybe<Scalars['BigInt']>;
  projectId_not?: Maybe<Scalars['BigInt']>;
  projectId_gt?: Maybe<Scalars['BigInt']>;
  projectId_lt?: Maybe<Scalars['BigInt']>;
  projectId_gte?: Maybe<Scalars['BigInt']>;
  projectId_lte?: Maybe<Scalars['BigInt']>;
  projectId_in?: Maybe<Array<Scalars['BigInt']>>;
  projectId_not_in?: Maybe<Array<Scalars['BigInt']>>;
  active?: Maybe<Scalars['Boolean']>;
  active_not?: Maybe<Scalars['Boolean']>;
  active_in?: Maybe<Array<Scalars['Boolean']>>;
  active_not_in?: Maybe<Array<Scalars['Boolean']>>;
  additionalPayee?: Maybe<Scalars['Bytes']>;
  additionalPayee_not?: Maybe<Scalars['Bytes']>;
  additionalPayee_in?: Maybe<Array<Scalars['Bytes']>>;
  additionalPayee_not_in?: Maybe<Array<Scalars['Bytes']>>;
  additionalPayee_contains?: Maybe<Scalars['Bytes']>;
  additionalPayee_not_contains?: Maybe<Scalars['Bytes']>;
  additionalPayeePercentage?: Maybe<Scalars['BigInt']>;
  additionalPayeePercentage_not?: Maybe<Scalars['BigInt']>;
  additionalPayeePercentage_gt?: Maybe<Scalars['BigInt']>;
  additionalPayeePercentage_lt?: Maybe<Scalars['BigInt']>;
  additionalPayeePercentage_gte?: Maybe<Scalars['BigInt']>;
  additionalPayeePercentage_lte?: Maybe<Scalars['BigInt']>;
  additionalPayeePercentage_in?: Maybe<Array<Scalars['BigInt']>>;
  additionalPayeePercentage_not_in?: Maybe<Array<Scalars['BigInt']>>;
  artist?: Maybe<Scalars['String']>;
  artist_not?: Maybe<Scalars['String']>;
  artist_gt?: Maybe<Scalars['String']>;
  artist_lt?: Maybe<Scalars['String']>;
  artist_gte?: Maybe<Scalars['String']>;
  artist_lte?: Maybe<Scalars['String']>;
  artist_in?: Maybe<Array<Scalars['String']>>;
  artist_not_in?: Maybe<Array<Scalars['String']>>;
  artist_contains?: Maybe<Scalars['String']>;
  artist_contains_nocase?: Maybe<Scalars['String']>;
  artist_not_contains?: Maybe<Scalars['String']>;
  artist_not_contains_nocase?: Maybe<Scalars['String']>;
  artist_starts_with?: Maybe<Scalars['String']>;
  artist_starts_with_nocase?: Maybe<Scalars['String']>;
  artist_not_starts_with?: Maybe<Scalars['String']>;
  artist_not_starts_with_nocase?: Maybe<Scalars['String']>;
  artist_ends_with?: Maybe<Scalars['String']>;
  artist_ends_with_nocase?: Maybe<Scalars['String']>;
  artist_not_ends_with?: Maybe<Scalars['String']>;
  artist_not_ends_with_nocase?: Maybe<Scalars['String']>;
  artist_?: Maybe<Account_Filter>;
  artistAddress?: Maybe<Scalars['Bytes']>;
  artistAddress_not?: Maybe<Scalars['Bytes']>;
  artistAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  artistAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  artistAddress_contains?: Maybe<Scalars['Bytes']>;
  artistAddress_not_contains?: Maybe<Scalars['Bytes']>;
  artistName?: Maybe<Scalars['String']>;
  artistName_not?: Maybe<Scalars['String']>;
  artistName_gt?: Maybe<Scalars['String']>;
  artistName_lt?: Maybe<Scalars['String']>;
  artistName_gte?: Maybe<Scalars['String']>;
  artistName_lte?: Maybe<Scalars['String']>;
  artistName_in?: Maybe<Array<Scalars['String']>>;
  artistName_not_in?: Maybe<Array<Scalars['String']>>;
  artistName_contains?: Maybe<Scalars['String']>;
  artistName_contains_nocase?: Maybe<Scalars['String']>;
  artistName_not_contains?: Maybe<Scalars['String']>;
  artistName_not_contains_nocase?: Maybe<Scalars['String']>;
  artistName_starts_with?: Maybe<Scalars['String']>;
  artistName_starts_with_nocase?: Maybe<Scalars['String']>;
  artistName_not_starts_with?: Maybe<Scalars['String']>;
  artistName_not_starts_with_nocase?: Maybe<Scalars['String']>;
  artistName_ends_with?: Maybe<Scalars['String']>;
  artistName_ends_with_nocase?: Maybe<Scalars['String']>;
  artistName_not_ends_with?: Maybe<Scalars['String']>;
  artistName_not_ends_with_nocase?: Maybe<Scalars['String']>;
  baseIpfsUri?: Maybe<Scalars['String']>;
  baseIpfsUri_not?: Maybe<Scalars['String']>;
  baseIpfsUri_gt?: Maybe<Scalars['String']>;
  baseIpfsUri_lt?: Maybe<Scalars['String']>;
  baseIpfsUri_gte?: Maybe<Scalars['String']>;
  baseIpfsUri_lte?: Maybe<Scalars['String']>;
  baseIpfsUri_in?: Maybe<Array<Scalars['String']>>;
  baseIpfsUri_not_in?: Maybe<Array<Scalars['String']>>;
  baseIpfsUri_contains?: Maybe<Scalars['String']>;
  baseIpfsUri_contains_nocase?: Maybe<Scalars['String']>;
  baseIpfsUri_not_contains?: Maybe<Scalars['String']>;
  baseIpfsUri_not_contains_nocase?: Maybe<Scalars['String']>;
  baseIpfsUri_starts_with?: Maybe<Scalars['String']>;
  baseIpfsUri_starts_with_nocase?: Maybe<Scalars['String']>;
  baseIpfsUri_not_starts_with?: Maybe<Scalars['String']>;
  baseIpfsUri_not_starts_with_nocase?: Maybe<Scalars['String']>;
  baseIpfsUri_ends_with?: Maybe<Scalars['String']>;
  baseIpfsUri_ends_with_nocase?: Maybe<Scalars['String']>;
  baseIpfsUri_not_ends_with?: Maybe<Scalars['String']>;
  baseIpfsUri_not_ends_with_nocase?: Maybe<Scalars['String']>;
  baseUri?: Maybe<Scalars['String']>;
  baseUri_not?: Maybe<Scalars['String']>;
  baseUri_gt?: Maybe<Scalars['String']>;
  baseUri_lt?: Maybe<Scalars['String']>;
  baseUri_gte?: Maybe<Scalars['String']>;
  baseUri_lte?: Maybe<Scalars['String']>;
  baseUri_in?: Maybe<Array<Scalars['String']>>;
  baseUri_not_in?: Maybe<Array<Scalars['String']>>;
  baseUri_contains?: Maybe<Scalars['String']>;
  baseUri_contains_nocase?: Maybe<Scalars['String']>;
  baseUri_not_contains?: Maybe<Scalars['String']>;
  baseUri_not_contains_nocase?: Maybe<Scalars['String']>;
  baseUri_starts_with?: Maybe<Scalars['String']>;
  baseUri_starts_with_nocase?: Maybe<Scalars['String']>;
  baseUri_not_starts_with?: Maybe<Scalars['String']>;
  baseUri_not_starts_with_nocase?: Maybe<Scalars['String']>;
  baseUri_ends_with?: Maybe<Scalars['String']>;
  baseUri_ends_with_nocase?: Maybe<Scalars['String']>;
  baseUri_not_ends_with?: Maybe<Scalars['String']>;
  baseUri_not_ends_with_nocase?: Maybe<Scalars['String']>;
  complete?: Maybe<Scalars['Boolean']>;
  complete_not?: Maybe<Scalars['Boolean']>;
  complete_in?: Maybe<Array<Scalars['Boolean']>>;
  complete_not_in?: Maybe<Array<Scalars['Boolean']>>;
  curationStatus?: Maybe<Scalars['String']>;
  curationStatus_not?: Maybe<Scalars['String']>;
  curationStatus_gt?: Maybe<Scalars['String']>;
  curationStatus_lt?: Maybe<Scalars['String']>;
  curationStatus_gte?: Maybe<Scalars['String']>;
  curationStatus_lte?: Maybe<Scalars['String']>;
  curationStatus_in?: Maybe<Array<Scalars['String']>>;
  curationStatus_not_in?: Maybe<Array<Scalars['String']>>;
  curationStatus_contains?: Maybe<Scalars['String']>;
  curationStatus_contains_nocase?: Maybe<Scalars['String']>;
  curationStatus_not_contains?: Maybe<Scalars['String']>;
  curationStatus_not_contains_nocase?: Maybe<Scalars['String']>;
  curationStatus_starts_with?: Maybe<Scalars['String']>;
  curationStatus_starts_with_nocase?: Maybe<Scalars['String']>;
  curationStatus_not_starts_with?: Maybe<Scalars['String']>;
  curationStatus_not_starts_with_nocase?: Maybe<Scalars['String']>;
  curationStatus_ends_with?: Maybe<Scalars['String']>;
  curationStatus_ends_with_nocase?: Maybe<Scalars['String']>;
  curationStatus_not_ends_with?: Maybe<Scalars['String']>;
  curationStatus_not_ends_with_nocase?: Maybe<Scalars['String']>;
  currencyAddress?: Maybe<Scalars['Bytes']>;
  currencyAddress_not?: Maybe<Scalars['Bytes']>;
  currencyAddress_in?: Maybe<Array<Scalars['Bytes']>>;
  currencyAddress_not_in?: Maybe<Array<Scalars['Bytes']>>;
  currencyAddress_contains?: Maybe<Scalars['Bytes']>;
  currencyAddress_not_contains?: Maybe<Scalars['Bytes']>;
  currencySymbol?: Maybe<Scalars['String']>;
  currencySymbol_not?: Maybe<Scalars['String']>;
  currencySymbol_gt?: Maybe<Scalars['String']>;
  currencySymbol_lt?: Maybe<Scalars['String']>;
  currencySymbol_gte?: Maybe<Scalars['String']>;
  currencySymbol_lte?: Maybe<Scalars['String']>;
  currencySymbol_in?: Maybe<Array<Scalars['String']>>;
  currencySymbol_not_in?: Maybe<Array<Scalars['String']>>;
  currencySymbol_contains?: Maybe<Scalars['String']>;
  currencySymbol_contains_nocase?: Maybe<Scalars['String']>;
  currencySymbol_not_contains?: Maybe<Scalars['String']>;
  currencySymbol_not_contains_nocase?: Maybe<Scalars['String']>;
  currencySymbol_starts_with?: Maybe<Scalars['String']>;
  currencySymbol_starts_with_nocase?: Maybe<Scalars['String']>;
  currencySymbol_not_starts_with?: Maybe<Scalars['String']>;
  currencySymbol_not_starts_with_nocase?: Maybe<Scalars['String']>;
  currencySymbol_ends_with?: Maybe<Scalars['String']>;
  currencySymbol_ends_with_nocase?: Maybe<Scalars['String']>;
  currencySymbol_not_ends_with?: Maybe<Scalars['String']>;
  currencySymbol_not_ends_with_nocase?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  description_not?: Maybe<Scalars['String']>;
  description_gt?: Maybe<Scalars['String']>;
  description_lt?: Maybe<Scalars['String']>;
  description_gte?: Maybe<Scalars['String']>;
  description_lte?: Maybe<Scalars['String']>;
  description_in?: Maybe<Array<Scalars['String']>>;
  description_not_in?: Maybe<Array<Scalars['String']>>;
  description_contains?: Maybe<Scalars['String']>;
  description_contains_nocase?: Maybe<Scalars['String']>;
  description_not_contains?: Maybe<Scalars['String']>;
  description_not_contains_nocase?: Maybe<Scalars['String']>;
  description_starts_with?: Maybe<Scalars['String']>;
  description_starts_with_nocase?: Maybe<Scalars['String']>;
  description_not_starts_with?: Maybe<Scalars['String']>;
  description_not_starts_with_nocase?: Maybe<Scalars['String']>;
  description_ends_with?: Maybe<Scalars['String']>;
  description_ends_with_nocase?: Maybe<Scalars['String']>;
  description_not_ends_with?: Maybe<Scalars['String']>;
  description_not_ends_with_nocase?: Maybe<Scalars['String']>;
  dynamic?: Maybe<Scalars['Boolean']>;
  dynamic_not?: Maybe<Scalars['Boolean']>;
  dynamic_in?: Maybe<Array<Scalars['Boolean']>>;
  dynamic_not_in?: Maybe<Array<Scalars['Boolean']>>;
  invocations?: Maybe<Scalars['BigInt']>;
  invocations_not?: Maybe<Scalars['BigInt']>;
  invocations_gt?: Maybe<Scalars['BigInt']>;
  invocations_lt?: Maybe<Scalars['BigInt']>;
  invocations_gte?: Maybe<Scalars['BigInt']>;
  invocations_lte?: Maybe<Scalars['BigInt']>;
  invocations_in?: Maybe<Array<Scalars['BigInt']>>;
  invocations_not_in?: Maybe<Array<Scalars['BigInt']>>;
  ipfsHash?: Maybe<Scalars['String']>;
  ipfsHash_not?: Maybe<Scalars['String']>;
  ipfsHash_gt?: Maybe<Scalars['String']>;
  ipfsHash_lt?: Maybe<Scalars['String']>;
  ipfsHash_gte?: Maybe<Scalars['String']>;
  ipfsHash_lte?: Maybe<Scalars['String']>;
  ipfsHash_in?: Maybe<Array<Scalars['String']>>;
  ipfsHash_not_in?: Maybe<Array<Scalars['String']>>;
  ipfsHash_contains?: Maybe<Scalars['String']>;
  ipfsHash_contains_nocase?: Maybe<Scalars['String']>;
  ipfsHash_not_contains?: Maybe<Scalars['String']>;
  ipfsHash_not_contains_nocase?: Maybe<Scalars['String']>;
  ipfsHash_starts_with?: Maybe<Scalars['String']>;
  ipfsHash_starts_with_nocase?: Maybe<Scalars['String']>;
  ipfsHash_not_starts_with?: Maybe<Scalars['String']>;
  ipfsHash_not_starts_with_nocase?: Maybe<Scalars['String']>;
  ipfsHash_ends_with?: Maybe<Scalars['String']>;
  ipfsHash_ends_with_nocase?: Maybe<Scalars['String']>;
  ipfsHash_not_ends_with?: Maybe<Scalars['String']>;
  ipfsHash_not_ends_with_nocase?: Maybe<Scalars['String']>;
  license?: Maybe<Scalars['String']>;
  license_not?: Maybe<Scalars['String']>;
  license_gt?: Maybe<Scalars['String']>;
  license_lt?: Maybe<Scalars['String']>;
  license_gte?: Maybe<Scalars['String']>;
  license_lte?: Maybe<Scalars['String']>;
  license_in?: Maybe<Array<Scalars['String']>>;
  license_not_in?: Maybe<Array<Scalars['String']>>;
  license_contains?: Maybe<Scalars['String']>;
  license_contains_nocase?: Maybe<Scalars['String']>;
  license_not_contains?: Maybe<Scalars['String']>;
  license_not_contains_nocase?: Maybe<Scalars['String']>;
  license_starts_with?: Maybe<Scalars['String']>;
  license_starts_with_nocase?: Maybe<Scalars['String']>;
  license_not_starts_with?: Maybe<Scalars['String']>;
  license_not_starts_with_nocase?: Maybe<Scalars['String']>;
  license_ends_with?: Maybe<Scalars['String']>;
  license_ends_with_nocase?: Maybe<Scalars['String']>;
  license_not_ends_with?: Maybe<Scalars['String']>;
  license_not_ends_with_nocase?: Maybe<Scalars['String']>;
  locked?: Maybe<Scalars['Boolean']>;
  locked_not?: Maybe<Scalars['Boolean']>;
  locked_in?: Maybe<Array<Scalars['Boolean']>>;
  locked_not_in?: Maybe<Array<Scalars['Boolean']>>;
  maxInvocations?: Maybe<Scalars['BigInt']>;
  maxInvocations_not?: Maybe<Scalars['BigInt']>;
  maxInvocations_gt?: Maybe<Scalars['BigInt']>;
  maxInvocations_lt?: Maybe<Scalars['BigInt']>;
  maxInvocations_gte?: Maybe<Scalars['BigInt']>;
  maxInvocations_lte?: Maybe<Scalars['BigInt']>;
  maxInvocations_in?: Maybe<Array<Scalars['BigInt']>>;
  maxInvocations_not_in?: Maybe<Array<Scalars['BigInt']>>;
  name?: Maybe<Scalars['String']>;
  name_not?: Maybe<Scalars['String']>;
  name_gt?: Maybe<Scalars['String']>;
  name_lt?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
  name_not_in?: Maybe<Array<Scalars['String']>>;
  name_contains?: Maybe<Scalars['String']>;
  name_contains_nocase?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_not_contains_nocase?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
  name_starts_with_nocase?: Maybe<Scalars['String']>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_not_starts_with_nocase?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_ends_with_nocase?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  name_not_ends_with_nocase?: Maybe<Scalars['String']>;
  paused?: Maybe<Scalars['Boolean']>;
  paused_not?: Maybe<Scalars['Boolean']>;
  paused_in?: Maybe<Array<Scalars['Boolean']>>;
  paused_not_in?: Maybe<Array<Scalars['Boolean']>>;
  pricePerTokenInWei?: Maybe<Scalars['BigInt']>;
  pricePerTokenInWei_not?: Maybe<Scalars['BigInt']>;
  pricePerTokenInWei_gt?: Maybe<Scalars['BigInt']>;
  pricePerTokenInWei_lt?: Maybe<Scalars['BigInt']>;
  pricePerTokenInWei_gte?: Maybe<Scalars['BigInt']>;
  pricePerTokenInWei_lte?: Maybe<Scalars['BigInt']>;
  pricePerTokenInWei_in?: Maybe<Array<Scalars['BigInt']>>;
  pricePerTokenInWei_not_in?: Maybe<Array<Scalars['BigInt']>>;
  royaltyPercentage?: Maybe<Scalars['BigInt']>;
  royaltyPercentage_not?: Maybe<Scalars['BigInt']>;
  royaltyPercentage_gt?: Maybe<Scalars['BigInt']>;
  royaltyPercentage_lt?: Maybe<Scalars['BigInt']>;
  royaltyPercentage_gte?: Maybe<Scalars['BigInt']>;
  royaltyPercentage_lte?: Maybe<Scalars['BigInt']>;
  royaltyPercentage_in?: Maybe<Array<Scalars['BigInt']>>;
  royaltyPercentage_not_in?: Maybe<Array<Scalars['BigInt']>>;
  script?: Maybe<Scalars['String']>;
  script_not?: Maybe<Scalars['String']>;
  script_gt?: Maybe<Scalars['String']>;
  script_lt?: Maybe<Scalars['String']>;
  script_gte?: Maybe<Scalars['String']>;
  script_lte?: Maybe<Scalars['String']>;
  script_in?: Maybe<Array<Scalars['String']>>;
  script_not_in?: Maybe<Array<Scalars['String']>>;
  script_contains?: Maybe<Scalars['String']>;
  script_contains_nocase?: Maybe<Scalars['String']>;
  script_not_contains?: Maybe<Scalars['String']>;
  script_not_contains_nocase?: Maybe<Scalars['String']>;
  script_starts_with?: Maybe<Scalars['String']>;
  script_starts_with_nocase?: Maybe<Scalars['String']>;
  script_not_starts_with?: Maybe<Scalars['String']>;
  script_not_starts_with_nocase?: Maybe<Scalars['String']>;
  script_ends_with?: Maybe<Scalars['String']>;
  script_ends_with_nocase?: Maybe<Scalars['String']>;
  script_not_ends_with?: Maybe<Scalars['String']>;
  script_not_ends_with_nocase?: Maybe<Scalars['String']>;
  scripts_?: Maybe<ProjectScript_Filter>;
  scriptCount?: Maybe<Scalars['BigInt']>;
  scriptCount_not?: Maybe<Scalars['BigInt']>;
  scriptCount_gt?: Maybe<Scalars['BigInt']>;
  scriptCount_lt?: Maybe<Scalars['BigInt']>;
  scriptCount_gte?: Maybe<Scalars['BigInt']>;
  scriptCount_lte?: Maybe<Scalars['BigInt']>;
  scriptCount_in?: Maybe<Array<Scalars['BigInt']>>;
  scriptCount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  scriptJSON?: Maybe<Scalars['String']>;
  scriptJSON_not?: Maybe<Scalars['String']>;
  scriptJSON_gt?: Maybe<Scalars['String']>;
  scriptJSON_lt?: Maybe<Scalars['String']>;
  scriptJSON_gte?: Maybe<Scalars['String']>;
  scriptJSON_lte?: Maybe<Scalars['String']>;
  scriptJSON_in?: Maybe<Array<Scalars['String']>>;
  scriptJSON_not_in?: Maybe<Array<Scalars['String']>>;
  scriptJSON_contains?: Maybe<Scalars['String']>;
  scriptJSON_contains_nocase?: Maybe<Scalars['String']>;
  scriptJSON_not_contains?: Maybe<Scalars['String']>;
  scriptJSON_not_contains_nocase?: Maybe<Scalars['String']>;
  scriptJSON_starts_with?: Maybe<Scalars['String']>;
  scriptJSON_starts_with_nocase?: Maybe<Scalars['String']>;
  scriptJSON_not_starts_with?: Maybe<Scalars['String']>;
  scriptJSON_not_starts_with_nocase?: Maybe<Scalars['String']>;
  scriptJSON_ends_with?: Maybe<Scalars['String']>;
  scriptJSON_ends_with_nocase?: Maybe<Scalars['String']>;
  scriptJSON_not_ends_with?: Maybe<Scalars['String']>;
  scriptJSON_not_ends_with_nocase?: Maybe<Scalars['String']>;
  tokens_?: Maybe<Token_Filter>;
  useHashString?: Maybe<Scalars['Boolean']>;
  useHashString_not?: Maybe<Scalars['Boolean']>;
  useHashString_in?: Maybe<Array<Scalars['Boolean']>>;
  useHashString_not_in?: Maybe<Array<Scalars['Boolean']>>;
  useIpfs?: Maybe<Scalars['Boolean']>;
  useIpfs_not?: Maybe<Scalars['Boolean']>;
  useIpfs_in?: Maybe<Array<Scalars['Boolean']>>;
  useIpfs_not_in?: Maybe<Array<Scalars['Boolean']>>;
  website?: Maybe<Scalars['String']>;
  website_not?: Maybe<Scalars['String']>;
  website_gt?: Maybe<Scalars['String']>;
  website_lt?: Maybe<Scalars['String']>;
  website_gte?: Maybe<Scalars['String']>;
  website_lte?: Maybe<Scalars['String']>;
  website_in?: Maybe<Array<Scalars['String']>>;
  website_not_in?: Maybe<Array<Scalars['String']>>;
  website_contains?: Maybe<Scalars['String']>;
  website_contains_nocase?: Maybe<Scalars['String']>;
  website_not_contains?: Maybe<Scalars['String']>;
  website_not_contains_nocase?: Maybe<Scalars['String']>;
  website_starts_with?: Maybe<Scalars['String']>;
  website_starts_with_nocase?: Maybe<Scalars['String']>;
  website_not_starts_with?: Maybe<Scalars['String']>;
  website_not_starts_with_nocase?: Maybe<Scalars['String']>;
  website_ends_with?: Maybe<Scalars['String']>;
  website_ends_with_nocase?: Maybe<Scalars['String']>;
  website_not_ends_with?: Maybe<Scalars['String']>;
  website_not_ends_with_nocase?: Maybe<Scalars['String']>;
  owners_?: Maybe<AccountProject_Filter>;
  createdAt?: Maybe<Scalars['BigInt']>;
  createdAt_not?: Maybe<Scalars['BigInt']>;
  createdAt_gt?: Maybe<Scalars['BigInt']>;
  createdAt_lt?: Maybe<Scalars['BigInt']>;
  createdAt_gte?: Maybe<Scalars['BigInt']>;
  createdAt_lte?: Maybe<Scalars['BigInt']>;
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  updatedAt?: Maybe<Scalars['BigInt']>;
  updatedAt_not?: Maybe<Scalars['BigInt']>;
  updatedAt_gt?: Maybe<Scalars['BigInt']>;
  updatedAt_lt?: Maybe<Scalars['BigInt']>;
  updatedAt_gte?: Maybe<Scalars['BigInt']>;
  updatedAt_lte?: Maybe<Scalars['BigInt']>;
  updatedAt_in?: Maybe<Array<Scalars['BigInt']>>;
  updatedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  activatedAt?: Maybe<Scalars['BigInt']>;
  activatedAt_not?: Maybe<Scalars['BigInt']>;
  activatedAt_gt?: Maybe<Scalars['BigInt']>;
  activatedAt_lt?: Maybe<Scalars['BigInt']>;
  activatedAt_gte?: Maybe<Scalars['BigInt']>;
  activatedAt_lte?: Maybe<Scalars['BigInt']>;
  activatedAt_in?: Maybe<Array<Scalars['BigInt']>>;
  activatedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  scriptUpdatedAt?: Maybe<Scalars['BigInt']>;
  scriptUpdatedAt_not?: Maybe<Scalars['BigInt']>;
  scriptUpdatedAt_gt?: Maybe<Scalars['BigInt']>;
  scriptUpdatedAt_lt?: Maybe<Scalars['BigInt']>;
  scriptUpdatedAt_gte?: Maybe<Scalars['BigInt']>;
  scriptUpdatedAt_lte?: Maybe<Scalars['BigInt']>;
  scriptUpdatedAt_in?: Maybe<Array<Scalars['BigInt']>>;
  scriptUpdatedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  contract?: Maybe<Scalars['String']>;
  contract_not?: Maybe<Scalars['String']>;
  contract_gt?: Maybe<Scalars['String']>;
  contract_lt?: Maybe<Scalars['String']>;
  contract_gte?: Maybe<Scalars['String']>;
  contract_lte?: Maybe<Scalars['String']>;
  contract_in?: Maybe<Array<Scalars['String']>>;
  contract_not_in?: Maybe<Array<Scalars['String']>>;
  contract_contains?: Maybe<Scalars['String']>;
  contract_contains_nocase?: Maybe<Scalars['String']>;
  contract_not_contains?: Maybe<Scalars['String']>;
  contract_not_contains_nocase?: Maybe<Scalars['String']>;
  contract_starts_with?: Maybe<Scalars['String']>;
  contract_starts_with_nocase?: Maybe<Scalars['String']>;
  contract_not_starts_with?: Maybe<Scalars['String']>;
  contract_not_starts_with_nocase?: Maybe<Scalars['String']>;
  contract_ends_with?: Maybe<Scalars['String']>;
  contract_ends_with_nocase?: Maybe<Scalars['String']>;
  contract_not_ends_with?: Maybe<Scalars['String']>;
  contract_not_ends_with_nocase?: Maybe<Scalars['String']>;
  contract_?: Maybe<Contract_Filter>;
  minterConfiguration?: Maybe<Scalars['String']>;
  minterConfiguration_not?: Maybe<Scalars['String']>;
  minterConfiguration_gt?: Maybe<Scalars['String']>;
  minterConfiguration_lt?: Maybe<Scalars['String']>;
  minterConfiguration_gte?: Maybe<Scalars['String']>;
  minterConfiguration_lte?: Maybe<Scalars['String']>;
  minterConfiguration_in?: Maybe<Array<Scalars['String']>>;
  minterConfiguration_not_in?: Maybe<Array<Scalars['String']>>;
  minterConfiguration_contains?: Maybe<Scalars['String']>;
  minterConfiguration_contains_nocase?: Maybe<Scalars['String']>;
  minterConfiguration_not_contains?: Maybe<Scalars['String']>;
  minterConfiguration_not_contains_nocase?: Maybe<Scalars['String']>;
  minterConfiguration_starts_with?: Maybe<Scalars['String']>;
  minterConfiguration_starts_with_nocase?: Maybe<Scalars['String']>;
  minterConfiguration_not_starts_with?: Maybe<Scalars['String']>;
  minterConfiguration_not_starts_with_nocase?: Maybe<Scalars['String']>;
  minterConfiguration_ends_with?: Maybe<Scalars['String']>;
  minterConfiguration_ends_with_nocase?: Maybe<Scalars['String']>;
  minterConfiguration_not_ends_with?: Maybe<Scalars['String']>;
  minterConfiguration_not_ends_with_nocase?: Maybe<Scalars['String']>;
  minterConfiguration_?: Maybe<ProjectMinterConfiguration_Filter>;
  saleLookupTables_?: Maybe<SaleLookupTable_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Project_OrderBy {
  Id = 'id',
  ProjectId = 'projectId',
  Active = 'active',
  AdditionalPayee = 'additionalPayee',
  AdditionalPayeePercentage = 'additionalPayeePercentage',
  Artist = 'artist',
  ArtistAddress = 'artistAddress',
  ArtistName = 'artistName',
  BaseIpfsUri = 'baseIpfsUri',
  BaseUri = 'baseUri',
  Complete = 'complete',
  CurationStatus = 'curationStatus',
  CurrencyAddress = 'currencyAddress',
  CurrencySymbol = 'currencySymbol',
  Description = 'description',
  Dynamic = 'dynamic',
  Invocations = 'invocations',
  IpfsHash = 'ipfsHash',
  License = 'license',
  Locked = 'locked',
  MaxInvocations = 'maxInvocations',
  Name = 'name',
  Paused = 'paused',
  PricePerTokenInWei = 'pricePerTokenInWei',
  RoyaltyPercentage = 'royaltyPercentage',
  Script = 'script',
  Scripts = 'scripts',
  ScriptCount = 'scriptCount',
  ScriptJson = 'scriptJSON',
  Tokens = 'tokens',
  UseHashString = 'useHashString',
  UseIpfs = 'useIpfs',
  Website = 'website',
  Owners = 'owners',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
  ActivatedAt = 'activatedAt',
  ScriptUpdatedAt = 'scriptUpdatedAt',
  Contract = 'contract',
  MinterConfiguration = 'minterConfiguration',
  SaleLookupTables = 'saleLookupTables'
}

export type Query = {
  __typename?: 'Query';
  project?: Maybe<Project>;
  projects: Array<Project>;
  projectScript?: Maybe<ProjectScript>;
  projectScripts: Array<ProjectScript>;
  contract?: Maybe<Contract>;
  contracts: Array<Contract>;
  whitelisting?: Maybe<Whitelisting>;
  whitelistings: Array<Whitelisting>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  accountProject?: Maybe<AccountProject>;
  accountProjects: Array<AccountProject>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  minterFilter?: Maybe<MinterFilter>;
  minterFilters: Array<MinterFilter>;
  minter?: Maybe<Minter>;
  minters: Array<Minter>;
  projectMinterConfiguration?: Maybe<ProjectMinterConfiguration>;
  projectMinterConfigurations: Array<ProjectMinterConfiguration>;
  sale?: Maybe<Sale>;
  sales: Array<Sale>;
  saleLookupTable?: Maybe<SaleLookupTable>;
  saleLookupTables: Array<SaleLookupTable>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryProjectArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Project_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Project_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectScriptArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectScriptsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ProjectScript_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<ProjectScript_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryContractArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryContractsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Contract_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Contract_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWhitelistingArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryWhitelistingsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Whitelisting_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Whitelisting_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Account_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Account_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountProjectArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountProjectsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AccountProject_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AccountProject_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMinterFilterArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMinterFiltersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MinterFilter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MinterFilter_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMinterArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMintersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Minter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Minter_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectMinterConfigurationArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryProjectMinterConfigurationsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ProjectMinterConfiguration_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<ProjectMinterConfiguration_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySaleArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySalesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Sale_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Sale_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySaleLookupTableArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySaleLookupTablesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SaleLookupTable_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SaleLookupTable_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type Sale = {
  __typename?: 'Sale';
  /** The sale id formated: tokenId - token.nextSaleId (using first token sold for bundles) for Opensea, orderHash from sale event for Looksrare */
  id: Scalars['ID'];
  /** The hash of the transaction */
  txHash: Scalars['Bytes'];
  /** The exchange used for this sale */
  exchange: Exchange;
  /** The sale type (Single | Bundle) */
  saleType: SaleType;
  /** The block number of the sale */
  blockNumber: Scalars['BigInt'];
  /** The timestamp of the sale */
  blockTimestamp: Scalars['BigInt'];
  /** A raw formated string of the token(s) sold (i.e TokenID1::TokenID2::TokenID3) */
  summaryTokensSold: Scalars['String'];
  /** Lookup table to get the list of Tokens sold in this sale */
  saleLookupTables: Array<SaleLookupTable>;
  /** The seller address */
  seller: Scalars['Bytes'];
  /** The buyer address */
  buyer: Scalars['Bytes'];
  /** The ERC20 token used for the payement */
  paymentToken: Scalars['Bytes'];
  /** The price of the sale */
  price: Scalars['BigInt'];
  /** Private sales are flagged by this boolean */
  isPrivate: Scalars['Boolean'];
};


export type SaleSaleLookupTablesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SaleLookupTable_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SaleLookupTable_Filter>;
};

export type SaleLookupTable = {
  __typename?: 'SaleLookupTable';
  /** Set to `Project Id::Token Id::Sale Id */
  id: Scalars['ID'];
  /** The block number of the sale */
  blockNumber: Scalars['BigInt'];
  /** Timestamp of the sale */
  timestamp: Scalars['BigInt'];
  /** The associated project */
  project: Project;
  /** The token sold */
  token: Token;
  /** The associated sale */
  sale: Sale;
};

export type SaleLookupTable_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  project?: Maybe<Scalars['String']>;
  project_not?: Maybe<Scalars['String']>;
  project_gt?: Maybe<Scalars['String']>;
  project_lt?: Maybe<Scalars['String']>;
  project_gte?: Maybe<Scalars['String']>;
  project_lte?: Maybe<Scalars['String']>;
  project_in?: Maybe<Array<Scalars['String']>>;
  project_not_in?: Maybe<Array<Scalars['String']>>;
  project_contains?: Maybe<Scalars['String']>;
  project_contains_nocase?: Maybe<Scalars['String']>;
  project_not_contains?: Maybe<Scalars['String']>;
  project_not_contains_nocase?: Maybe<Scalars['String']>;
  project_starts_with?: Maybe<Scalars['String']>;
  project_starts_with_nocase?: Maybe<Scalars['String']>;
  project_not_starts_with?: Maybe<Scalars['String']>;
  project_not_starts_with_nocase?: Maybe<Scalars['String']>;
  project_ends_with?: Maybe<Scalars['String']>;
  project_ends_with_nocase?: Maybe<Scalars['String']>;
  project_not_ends_with?: Maybe<Scalars['String']>;
  project_not_ends_with_nocase?: Maybe<Scalars['String']>;
  project_?: Maybe<Project_Filter>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_contains_nocase?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_not_contains_nocase?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_starts_with_nocase?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with_nocase?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_ends_with_nocase?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with_nocase?: Maybe<Scalars['String']>;
  token_?: Maybe<Token_Filter>;
  sale?: Maybe<Scalars['String']>;
  sale_not?: Maybe<Scalars['String']>;
  sale_gt?: Maybe<Scalars['String']>;
  sale_lt?: Maybe<Scalars['String']>;
  sale_gte?: Maybe<Scalars['String']>;
  sale_lte?: Maybe<Scalars['String']>;
  sale_in?: Maybe<Array<Scalars['String']>>;
  sale_not_in?: Maybe<Array<Scalars['String']>>;
  sale_contains?: Maybe<Scalars['String']>;
  sale_contains_nocase?: Maybe<Scalars['String']>;
  sale_not_contains?: Maybe<Scalars['String']>;
  sale_not_contains_nocase?: Maybe<Scalars['String']>;
  sale_starts_with?: Maybe<Scalars['String']>;
  sale_starts_with_nocase?: Maybe<Scalars['String']>;
  sale_not_starts_with?: Maybe<Scalars['String']>;
  sale_not_starts_with_nocase?: Maybe<Scalars['String']>;
  sale_ends_with?: Maybe<Scalars['String']>;
  sale_ends_with_nocase?: Maybe<Scalars['String']>;
  sale_not_ends_with?: Maybe<Scalars['String']>;
  sale_not_ends_with_nocase?: Maybe<Scalars['String']>;
  sale_?: Maybe<Sale_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum SaleLookupTable_OrderBy {
  Id = 'id',
  BlockNumber = 'blockNumber',
  Timestamp = 'timestamp',
  Project = 'project',
  Token = 'token',
  Sale = 'sale'
}

export enum SaleType {
  Single = 'Single',
  Bundle = 'Bundle'
}

export type Sale_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  txHash?: Maybe<Scalars['Bytes']>;
  txHash_not?: Maybe<Scalars['Bytes']>;
  txHash_in?: Maybe<Array<Scalars['Bytes']>>;
  txHash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  txHash_contains?: Maybe<Scalars['Bytes']>;
  txHash_not_contains?: Maybe<Scalars['Bytes']>;
  exchange?: Maybe<Exchange>;
  exchange_not?: Maybe<Exchange>;
  exchange_in?: Maybe<Array<Exchange>>;
  exchange_not_in?: Maybe<Array<Exchange>>;
  saleType?: Maybe<SaleType>;
  saleType_not?: Maybe<SaleType>;
  saleType_in?: Maybe<Array<SaleType>>;
  saleType_not_in?: Maybe<Array<SaleType>>;
  blockNumber?: Maybe<Scalars['BigInt']>;
  blockNumber_not?: Maybe<Scalars['BigInt']>;
  blockNumber_gt?: Maybe<Scalars['BigInt']>;
  blockNumber_lt?: Maybe<Scalars['BigInt']>;
  blockNumber_gte?: Maybe<Scalars['BigInt']>;
  blockNumber_lte?: Maybe<Scalars['BigInt']>;
  blockNumber_in?: Maybe<Array<Scalars['BigInt']>>;
  blockNumber_not_in?: Maybe<Array<Scalars['BigInt']>>;
  blockTimestamp?: Maybe<Scalars['BigInt']>;
  blockTimestamp_not?: Maybe<Scalars['BigInt']>;
  blockTimestamp_gt?: Maybe<Scalars['BigInt']>;
  blockTimestamp_lt?: Maybe<Scalars['BigInt']>;
  blockTimestamp_gte?: Maybe<Scalars['BigInt']>;
  blockTimestamp_lte?: Maybe<Scalars['BigInt']>;
  blockTimestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  blockTimestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  summaryTokensSold?: Maybe<Scalars['String']>;
  summaryTokensSold_not?: Maybe<Scalars['String']>;
  summaryTokensSold_gt?: Maybe<Scalars['String']>;
  summaryTokensSold_lt?: Maybe<Scalars['String']>;
  summaryTokensSold_gte?: Maybe<Scalars['String']>;
  summaryTokensSold_lte?: Maybe<Scalars['String']>;
  summaryTokensSold_in?: Maybe<Array<Scalars['String']>>;
  summaryTokensSold_not_in?: Maybe<Array<Scalars['String']>>;
  summaryTokensSold_contains?: Maybe<Scalars['String']>;
  summaryTokensSold_contains_nocase?: Maybe<Scalars['String']>;
  summaryTokensSold_not_contains?: Maybe<Scalars['String']>;
  summaryTokensSold_not_contains_nocase?: Maybe<Scalars['String']>;
  summaryTokensSold_starts_with?: Maybe<Scalars['String']>;
  summaryTokensSold_starts_with_nocase?: Maybe<Scalars['String']>;
  summaryTokensSold_not_starts_with?: Maybe<Scalars['String']>;
  summaryTokensSold_not_starts_with_nocase?: Maybe<Scalars['String']>;
  summaryTokensSold_ends_with?: Maybe<Scalars['String']>;
  summaryTokensSold_ends_with_nocase?: Maybe<Scalars['String']>;
  summaryTokensSold_not_ends_with?: Maybe<Scalars['String']>;
  summaryTokensSold_not_ends_with_nocase?: Maybe<Scalars['String']>;
  saleLookupTables_?: Maybe<SaleLookupTable_Filter>;
  seller?: Maybe<Scalars['Bytes']>;
  seller_not?: Maybe<Scalars['Bytes']>;
  seller_in?: Maybe<Array<Scalars['Bytes']>>;
  seller_not_in?: Maybe<Array<Scalars['Bytes']>>;
  seller_contains?: Maybe<Scalars['Bytes']>;
  seller_not_contains?: Maybe<Scalars['Bytes']>;
  buyer?: Maybe<Scalars['Bytes']>;
  buyer_not?: Maybe<Scalars['Bytes']>;
  buyer_in?: Maybe<Array<Scalars['Bytes']>>;
  buyer_not_in?: Maybe<Array<Scalars['Bytes']>>;
  buyer_contains?: Maybe<Scalars['Bytes']>;
  buyer_not_contains?: Maybe<Scalars['Bytes']>;
  paymentToken?: Maybe<Scalars['Bytes']>;
  paymentToken_not?: Maybe<Scalars['Bytes']>;
  paymentToken_in?: Maybe<Array<Scalars['Bytes']>>;
  paymentToken_not_in?: Maybe<Array<Scalars['Bytes']>>;
  paymentToken_contains?: Maybe<Scalars['Bytes']>;
  paymentToken_not_contains?: Maybe<Scalars['Bytes']>;
  price?: Maybe<Scalars['BigInt']>;
  price_not?: Maybe<Scalars['BigInt']>;
  price_gt?: Maybe<Scalars['BigInt']>;
  price_lt?: Maybe<Scalars['BigInt']>;
  price_gte?: Maybe<Scalars['BigInt']>;
  price_lte?: Maybe<Scalars['BigInt']>;
  price_in?: Maybe<Array<Scalars['BigInt']>>;
  price_not_in?: Maybe<Array<Scalars['BigInt']>>;
  isPrivate?: Maybe<Scalars['Boolean']>;
  isPrivate_not?: Maybe<Scalars['Boolean']>;
  isPrivate_in?: Maybe<Array<Scalars['Boolean']>>;
  isPrivate_not_in?: Maybe<Array<Scalars['Boolean']>>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Sale_OrderBy {
  Id = 'id',
  TxHash = 'txHash',
  Exchange = 'exchange',
  SaleType = 'saleType',
  BlockNumber = 'blockNumber',
  BlockTimestamp = 'blockTimestamp',
  SummaryTokensSold = 'summaryTokensSold',
  SaleLookupTables = 'saleLookupTables',
  Seller = 'seller',
  Buyer = 'buyer',
  PaymentToken = 'paymentToken',
  Price = 'price',
  IsPrivate = 'isPrivate'
}

export type Subscription = {
  __typename?: 'Subscription';
  project?: Maybe<Project>;
  projects: Array<Project>;
  projectScript?: Maybe<ProjectScript>;
  projectScripts: Array<ProjectScript>;
  contract?: Maybe<Contract>;
  contracts: Array<Contract>;
  whitelisting?: Maybe<Whitelisting>;
  whitelistings: Array<Whitelisting>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  accountProject?: Maybe<AccountProject>;
  accountProjects: Array<AccountProject>;
  token?: Maybe<Token>;
  tokens: Array<Token>;
  minterFilter?: Maybe<MinterFilter>;
  minterFilters: Array<MinterFilter>;
  minter?: Maybe<Minter>;
  minters: Array<Minter>;
  projectMinterConfiguration?: Maybe<ProjectMinterConfiguration>;
  projectMinterConfigurations: Array<ProjectMinterConfiguration>;
  sale?: Maybe<Sale>;
  sales: Array<Sale>;
  saleLookupTable?: Maybe<SaleLookupTable>;
  saleLookupTables: Array<SaleLookupTable>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionProjectArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Project_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Project_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectScriptArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectScriptsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ProjectScript_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<ProjectScript_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionContractArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionContractsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Contract_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Contract_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWhitelistingArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionWhitelistingsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Whitelisting_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Whitelisting_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Account_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Account_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountProjectArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountProjectsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<AccountProject_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<AccountProject_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMinterFilterArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMinterFiltersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MinterFilter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MinterFilter_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMinterArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMintersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Minter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Minter_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectMinterConfigurationArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionProjectMinterConfigurationsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<ProjectMinterConfiguration_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<ProjectMinterConfiguration_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSaleArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSalesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Sale_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Sale_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSaleLookupTableArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSaleLookupTablesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SaleLookupTable_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SaleLookupTable_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type Token = {
  __typename?: 'Token';
  /** Unique identifier made up of contract address and token id */
  id: Scalars['ID'];
  /** ID of the token on the contract */
  tokenId: Scalars['BigInt'];
  /** Contract the token is on */
  contract: Contract;
  /** Invocation number of the project */
  invocation: Scalars['BigInt'];
  /** Unique string used as input to the tokens project script */
  hash: Scalars['Bytes'];
  /** Current owner of the token */
  owner: Account;
  /** Project of the token */
  project: Project;
  uri?: Maybe<Scalars['String']>;
  createdAt: Scalars['BigInt'];
  updatedAt: Scalars['BigInt'];
  /** Transaction hash of token mint */
  transactionHash: Scalars['Bytes'];
  /** Lookup table to get the Sale history */
  saleLookupTables: Array<SaleLookupTable>;
  /** Next available sale id */
  nextSaleId: Scalars['BigInt'];
};


export type TokenSaleLookupTablesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<SaleLookupTable_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<SaleLookupTable_Filter>;
};

export type Token_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  tokenId?: Maybe<Scalars['BigInt']>;
  tokenId_not?: Maybe<Scalars['BigInt']>;
  tokenId_gt?: Maybe<Scalars['BigInt']>;
  tokenId_lt?: Maybe<Scalars['BigInt']>;
  tokenId_gte?: Maybe<Scalars['BigInt']>;
  tokenId_lte?: Maybe<Scalars['BigInt']>;
  tokenId_in?: Maybe<Array<Scalars['BigInt']>>;
  tokenId_not_in?: Maybe<Array<Scalars['BigInt']>>;
  contract?: Maybe<Scalars['String']>;
  contract_not?: Maybe<Scalars['String']>;
  contract_gt?: Maybe<Scalars['String']>;
  contract_lt?: Maybe<Scalars['String']>;
  contract_gte?: Maybe<Scalars['String']>;
  contract_lte?: Maybe<Scalars['String']>;
  contract_in?: Maybe<Array<Scalars['String']>>;
  contract_not_in?: Maybe<Array<Scalars['String']>>;
  contract_contains?: Maybe<Scalars['String']>;
  contract_contains_nocase?: Maybe<Scalars['String']>;
  contract_not_contains?: Maybe<Scalars['String']>;
  contract_not_contains_nocase?: Maybe<Scalars['String']>;
  contract_starts_with?: Maybe<Scalars['String']>;
  contract_starts_with_nocase?: Maybe<Scalars['String']>;
  contract_not_starts_with?: Maybe<Scalars['String']>;
  contract_not_starts_with_nocase?: Maybe<Scalars['String']>;
  contract_ends_with?: Maybe<Scalars['String']>;
  contract_ends_with_nocase?: Maybe<Scalars['String']>;
  contract_not_ends_with?: Maybe<Scalars['String']>;
  contract_not_ends_with_nocase?: Maybe<Scalars['String']>;
  contract_?: Maybe<Contract_Filter>;
  invocation?: Maybe<Scalars['BigInt']>;
  invocation_not?: Maybe<Scalars['BigInt']>;
  invocation_gt?: Maybe<Scalars['BigInt']>;
  invocation_lt?: Maybe<Scalars['BigInt']>;
  invocation_gte?: Maybe<Scalars['BigInt']>;
  invocation_lte?: Maybe<Scalars['BigInt']>;
  invocation_in?: Maybe<Array<Scalars['BigInt']>>;
  invocation_not_in?: Maybe<Array<Scalars['BigInt']>>;
  hash?: Maybe<Scalars['Bytes']>;
  hash_not?: Maybe<Scalars['Bytes']>;
  hash_in?: Maybe<Array<Scalars['Bytes']>>;
  hash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  hash_contains?: Maybe<Scalars['Bytes']>;
  hash_not_contains?: Maybe<Scalars['Bytes']>;
  owner?: Maybe<Scalars['String']>;
  owner_not?: Maybe<Scalars['String']>;
  owner_gt?: Maybe<Scalars['String']>;
  owner_lt?: Maybe<Scalars['String']>;
  owner_gte?: Maybe<Scalars['String']>;
  owner_lte?: Maybe<Scalars['String']>;
  owner_in?: Maybe<Array<Scalars['String']>>;
  owner_not_in?: Maybe<Array<Scalars['String']>>;
  owner_contains?: Maybe<Scalars['String']>;
  owner_contains_nocase?: Maybe<Scalars['String']>;
  owner_not_contains?: Maybe<Scalars['String']>;
  owner_not_contains_nocase?: Maybe<Scalars['String']>;
  owner_starts_with?: Maybe<Scalars['String']>;
  owner_starts_with_nocase?: Maybe<Scalars['String']>;
  owner_not_starts_with?: Maybe<Scalars['String']>;
  owner_not_starts_with_nocase?: Maybe<Scalars['String']>;
  owner_ends_with?: Maybe<Scalars['String']>;
  owner_ends_with_nocase?: Maybe<Scalars['String']>;
  owner_not_ends_with?: Maybe<Scalars['String']>;
  owner_not_ends_with_nocase?: Maybe<Scalars['String']>;
  owner_?: Maybe<Account_Filter>;
  project?: Maybe<Scalars['String']>;
  project_not?: Maybe<Scalars['String']>;
  project_gt?: Maybe<Scalars['String']>;
  project_lt?: Maybe<Scalars['String']>;
  project_gte?: Maybe<Scalars['String']>;
  project_lte?: Maybe<Scalars['String']>;
  project_in?: Maybe<Array<Scalars['String']>>;
  project_not_in?: Maybe<Array<Scalars['String']>>;
  project_contains?: Maybe<Scalars['String']>;
  project_contains_nocase?: Maybe<Scalars['String']>;
  project_not_contains?: Maybe<Scalars['String']>;
  project_not_contains_nocase?: Maybe<Scalars['String']>;
  project_starts_with?: Maybe<Scalars['String']>;
  project_starts_with_nocase?: Maybe<Scalars['String']>;
  project_not_starts_with?: Maybe<Scalars['String']>;
  project_not_starts_with_nocase?: Maybe<Scalars['String']>;
  project_ends_with?: Maybe<Scalars['String']>;
  project_ends_with_nocase?: Maybe<Scalars['String']>;
  project_not_ends_with?: Maybe<Scalars['String']>;
  project_not_ends_with_nocase?: Maybe<Scalars['String']>;
  project_?: Maybe<Project_Filter>;
  uri?: Maybe<Scalars['String']>;
  uri_not?: Maybe<Scalars['String']>;
  uri_gt?: Maybe<Scalars['String']>;
  uri_lt?: Maybe<Scalars['String']>;
  uri_gte?: Maybe<Scalars['String']>;
  uri_lte?: Maybe<Scalars['String']>;
  uri_in?: Maybe<Array<Scalars['String']>>;
  uri_not_in?: Maybe<Array<Scalars['String']>>;
  uri_contains?: Maybe<Scalars['String']>;
  uri_contains_nocase?: Maybe<Scalars['String']>;
  uri_not_contains?: Maybe<Scalars['String']>;
  uri_not_contains_nocase?: Maybe<Scalars['String']>;
  uri_starts_with?: Maybe<Scalars['String']>;
  uri_starts_with_nocase?: Maybe<Scalars['String']>;
  uri_not_starts_with?: Maybe<Scalars['String']>;
  uri_not_starts_with_nocase?: Maybe<Scalars['String']>;
  uri_ends_with?: Maybe<Scalars['String']>;
  uri_ends_with_nocase?: Maybe<Scalars['String']>;
  uri_not_ends_with?: Maybe<Scalars['String']>;
  uri_not_ends_with_nocase?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['BigInt']>;
  createdAt_not?: Maybe<Scalars['BigInt']>;
  createdAt_gt?: Maybe<Scalars['BigInt']>;
  createdAt_lt?: Maybe<Scalars['BigInt']>;
  createdAt_gte?: Maybe<Scalars['BigInt']>;
  createdAt_lte?: Maybe<Scalars['BigInt']>;
  createdAt_in?: Maybe<Array<Scalars['BigInt']>>;
  createdAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  updatedAt?: Maybe<Scalars['BigInt']>;
  updatedAt_not?: Maybe<Scalars['BigInt']>;
  updatedAt_gt?: Maybe<Scalars['BigInt']>;
  updatedAt_lt?: Maybe<Scalars['BigInt']>;
  updatedAt_gte?: Maybe<Scalars['BigInt']>;
  updatedAt_lte?: Maybe<Scalars['BigInt']>;
  updatedAt_in?: Maybe<Array<Scalars['BigInt']>>;
  updatedAt_not_in?: Maybe<Array<Scalars['BigInt']>>;
  transactionHash?: Maybe<Scalars['Bytes']>;
  transactionHash_not?: Maybe<Scalars['Bytes']>;
  transactionHash_in?: Maybe<Array<Scalars['Bytes']>>;
  transactionHash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  transactionHash_contains?: Maybe<Scalars['Bytes']>;
  transactionHash_not_contains?: Maybe<Scalars['Bytes']>;
  saleLookupTables_?: Maybe<SaleLookupTable_Filter>;
  nextSaleId?: Maybe<Scalars['BigInt']>;
  nextSaleId_not?: Maybe<Scalars['BigInt']>;
  nextSaleId_gt?: Maybe<Scalars['BigInt']>;
  nextSaleId_lt?: Maybe<Scalars['BigInt']>;
  nextSaleId_gte?: Maybe<Scalars['BigInt']>;
  nextSaleId_lte?: Maybe<Scalars['BigInt']>;
  nextSaleId_in?: Maybe<Array<Scalars['BigInt']>>;
  nextSaleId_not_in?: Maybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Token_OrderBy {
  Id = 'id',
  TokenId = 'tokenId',
  Contract = 'contract',
  Invocation = 'invocation',
  Hash = 'hash',
  Owner = 'owner',
  Project = 'project',
  Uri = 'uri',
  CreatedAt = 'createdAt',
  UpdatedAt = 'updatedAt',
  TransactionHash = 'transactionHash',
  SaleLookupTables = 'saleLookupTables',
  NextSaleId = 'nextSaleId'
}

export type Whitelisting = {
  __typename?: 'Whitelisting';
  id: Scalars['ID'];
  account: Account;
  contract: Contract;
};

export type Whitelisting_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  account?: Maybe<Scalars['String']>;
  account_not?: Maybe<Scalars['String']>;
  account_gt?: Maybe<Scalars['String']>;
  account_lt?: Maybe<Scalars['String']>;
  account_gte?: Maybe<Scalars['String']>;
  account_lte?: Maybe<Scalars['String']>;
  account_in?: Maybe<Array<Scalars['String']>>;
  account_not_in?: Maybe<Array<Scalars['String']>>;
  account_contains?: Maybe<Scalars['String']>;
  account_contains_nocase?: Maybe<Scalars['String']>;
  account_not_contains?: Maybe<Scalars['String']>;
  account_not_contains_nocase?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_starts_with_nocase?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with_nocase?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_ends_with_nocase?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with_nocase?: Maybe<Scalars['String']>;
  account_?: Maybe<Account_Filter>;
  contract?: Maybe<Scalars['String']>;
  contract_not?: Maybe<Scalars['String']>;
  contract_gt?: Maybe<Scalars['String']>;
  contract_lt?: Maybe<Scalars['String']>;
  contract_gte?: Maybe<Scalars['String']>;
  contract_lte?: Maybe<Scalars['String']>;
  contract_in?: Maybe<Array<Scalars['String']>>;
  contract_not_in?: Maybe<Array<Scalars['String']>>;
  contract_contains?: Maybe<Scalars['String']>;
  contract_contains_nocase?: Maybe<Scalars['String']>;
  contract_not_contains?: Maybe<Scalars['String']>;
  contract_not_contains_nocase?: Maybe<Scalars['String']>;
  contract_starts_with?: Maybe<Scalars['String']>;
  contract_starts_with_nocase?: Maybe<Scalars['String']>;
  contract_not_starts_with?: Maybe<Scalars['String']>;
  contract_not_starts_with_nocase?: Maybe<Scalars['String']>;
  contract_ends_with?: Maybe<Scalars['String']>;
  contract_ends_with_nocase?: Maybe<Scalars['String']>;
  contract_not_ends_with?: Maybe<Scalars['String']>;
  contract_not_ends_with_nocase?: Maybe<Scalars['String']>;
  contract_?: Maybe<Contract_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Whitelisting_OrderBy {
  Id = 'id',
  Account = 'account',
  Contract = 'contract'
}

export type _Block_ = {
  __typename?: '_Block_';
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: '_Meta_';
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type GetProjectsInfoQueryVariables = Exact<{
  first: Scalars['Int'];
  skip: Scalars['Int'];
  contracts: Array<Scalars['String']> | Scalars['String'];
}>;


export type GetProjectsInfoQuery = (
  { __typename?: 'Query' }
  & { projects: Array<(
    { __typename?: 'Project' }
    & Pick<Project, 'id' | 'projectId' | 'curationStatus' | 'name' | 'artistAddress' | 'additionalPayee' | 'additionalPayeePercentage' | 'invocations'>
    & { contract: (
      { __typename?: 'Contract' }
      & Pick<Contract, 'id'>
    ) }
  )> }
);


export const GetProjectsInfoDocument = gql`
    query getProjectsInfo($first: Int!, $skip: Int!, $contracts: [String!]!) {
  projects(
    first: $first
    skip: $skip
    orderBy: projectId
    where: {invocations_not: 0, contract_in: $contracts}
  ) {
    id
    projectId
    curationStatus
    contract {
      id
    }
    name
    artistAddress
    additionalPayee
    additionalPayeePercentage
    invocations
  }
}
    `;