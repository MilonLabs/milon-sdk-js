export const DEFAULT_IDLS = [
  {
    "metadata": {
      "app_id": 0,
      "name": "system",
      "description": "Milon system app IDL"
    },
    "instructions": [
      {
        "args": [],
        "discriminator": 13507,
        "handler": "noop",
        "kind": "entry",
        "name": "Noop"
      },
      {
        "args": [
          {
            "name": "start_timestamp_ms",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "min_duration_ms",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 57604,
        "handler": "bootstrap_epoch_clock",
        "kind": "entry",
        "name": "BootstrapEpochClock"
      },
      {
        "args": [
          {
            "name": "max_validator_set_size",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "group_threshold_ratio_num",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "group_threshold_ratio_den",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "block_threshold_ratio_num",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "block_threshold_ratio_den",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "batch_committee_ratio_num",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "batch_committee_ratio_den",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 37696,
        "handler": "bootstrap_validator_set_config",
        "kind": "entry",
        "name": "BootstrapValidatorSetConfig"
      },
      {
        "args": [
          {
            "name": "validators",
            "role": "input",
            "type": "vec<B256>"
          }
        ],
        "discriminator": 46958,
        "handler": "bootstrap_registered_validator_set",
        "kind": "entry",
        "name": "BootstrapRegisteredValidatorSet"
      },
      {
        "args": [],
        "discriminator": 49456,
        "handler": "commit_block_seed",
        "kind": "entry",
        "name": "CommitBlockSeed"
      },
      {
        "args": [
          {
            "name": "params",
            "role": "input",
            "type": "vec<tuple<u16,bytes>>"
          }
        ],
        "discriminator": 34076,
        "handler": "bootstrap_chain_params",
        "kind": "entry",
        "name": "BootstrapChainParams"
      },
      {
        "args": [
          {
            "name": "feature_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "kind",
            "role": "input",
            "type": "ProposalKind"
          }
        ],
        "discriminator": 50539,
        "gas_exempt": true,
        "handler": "propose",
        "kind": "entry",
        "name": "Propose",
        "requires_pq_signature": true,
        "validator": true,
        "validator_signer_mode": "any_signer"
      },
      {
        "args": [
          {
            "name": "params",
            "role": "input",
            "type": "vec<tuple<u16,bytes>>"
          },
          {
            "name": "kind",
            "role": "input",
            "type": "ProposalKind"
          }
        ],
        "discriminator": 54058,
        "gas_exempt": true,
        "handler": "propose_params",
        "kind": "entry",
        "name": "ProposeParams",
        "requires_pq_signature": true,
        "validator": true,
        "validator_signer_mode": "any_signer"
      },
      {
        "args": [
          {
            "name": "feature_id",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 56775,
        "gas_exempt": true,
        "handler": "vote",
        "kind": "entry",
        "name": "Vote",
        "requires_pq_signature": true,
        "validator": true,
        "validator_signer_mode": "any_signer"
      },
      {
        "args": [
          {
            "name": "feature_id",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 46921,
        "gas_exempt": true,
        "handler": "cancel",
        "kind": "entry",
        "name": "Cancel",
        "requires_pq_signature": true,
        "validator": true,
        "validator_signer_mode": "any_signer"
      },
      {
        "args": [
          {
            "name": "feature_id",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 45954,
        "handler": "close_vote",
        "kind": "entry",
        "name": "CloseVote"
      },
      {
        "args": [],
        "discriminator": 17384,
        "handler": "upgrade_status",
        "kind": "view",
        "name": "UpgradeStatus",
        "returns": {
          "type": "UpgradeStatus"
        }
      },
      {
        "args": [
          {
            "name": "start",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "limit",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 57418,
        "handler": "proposal_history",
        "kind": "view",
        "name": "ProposalHistory",
        "returns": {
          "type": "vec<ProposalHistoryItem>"
        }
      },
      {
        "args": [],
        "discriminator": 30595,
        "handler": "available_methods",
        "kind": "view",
        "name": "AvailableMethods",
        "returns": {
          "type": "vec<AppMethods>"
        }
      },
      {
        "args": [
          {
            "name": "feature_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "proposed_height",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 12558,
        "handler": "proposal_outcome",
        "kind": "view",
        "name": "ProposalOutcome",
        "returns": {
          "type": "option<ProposalOutcome>"
        }
      }
    ],
    "types": [
      {
        "fields": [
          {
            "name": "written",
            "type": "bool"
          },
          {
            "name": "number",
            "type": "u64"
          },
          {
            "name": "hash",
            "type": "B256"
          }
        ],
        "kind": "struct",
        "name": "RecentBlock",
        "typeTag": "14176988562306742379"
      },
      {
        "kind": "enum",
        "name": "ProposalKind",
        "typeTag": "1402225824386926607",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Normal"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Urgent"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "feature_id",
            "type": "u32"
          },
          {
            "name": "kind",
            "type": "ProposalKind"
          },
          {
            "name": "params",
            "type": "vec<tuple<u16,bytes>>"
          },
          {
            "name": "proposed_height",
            "type": "u64"
          },
          {
            "name": "vote_end_time",
            "type": "u64"
          },
          {
            "name": "fast_pass",
            "type": "bool"
          },
          {
            "name": "proposer_validator",
            "type": "B256"
          }
        ],
        "kind": "struct",
        "name": "Proposal",
        "typeTag": "7597941116962734961"
      },
      {
        "fields": [
          {
            "name": "activated_height",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "FeatureRecord",
        "typeTag": "7604164637852620690"
      },
      {
        "kind": "enum",
        "name": "ProposalResult",
        "typeTag": "13530239686553251584",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Passed"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Expired"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Cancelled"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "result",
            "type": "ProposalResult"
          },
          {
            "name": "height",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "ProposalOutcome",
        "typeTag": "18173885799688015607"
      },
      {
        "fields": [
          {
            "name": "feature_id",
            "type": "u32"
          },
          {
            "name": "proposed_height",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "ProposalKey",
        "typeTag": "9879718488824214520"
      },
      {
        "fields": [
          {
            "name": "occupied",
            "type": "bool"
          },
          {
            "name": "feature_id",
            "type": "u32"
          },
          {
            "name": "released_height",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "KindSlot",
        "typeTag": "7385424433979822081"
      },
      {
        "fields": [
          {
            "name": "feature_id",
            "type": "u32"
          },
          {
            "name": "activated_height",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "ActiveFeature",
        "typeTag": "14856808012947254905"
      },
      {
        "fields": [
          {
            "name": "proposal",
            "type": "Proposal"
          },
          {
            "name": "votes",
            "type": "u32"
          },
          {
            "name": "eligible",
            "type": "u32"
          },
          {
            "name": "fast_threshold",
            "type": "u32"
          },
          {
            "name": "pass_threshold",
            "type": "u32"
          }
        ],
        "kind": "struct",
        "name": "ProposalStatus",
        "typeTag": "3740167392104146899"
      },
      {
        "fields": [
          {
            "name": "seq",
            "type": "u64"
          },
          {
            "name": "feature_id",
            "type": "u32"
          },
          {
            "name": "proposed_height",
            "type": "u64"
          },
          {
            "name": "outcome",
            "type": "ProposalOutcome"
          }
        ],
        "kind": "struct",
        "name": "ProposalHistoryItem",
        "typeTag": "17096457384972719636"
      },
      {
        "fields": [
          {
            "name": "active",
            "type": "vec<ActiveFeature>"
          },
          {
            "name": "proposals",
            "type": "vec<ProposalStatus>"
          },
          {
            "name": "params",
            "type": "vec<tuple<u16,bytes>>"
          },
          {
            "name": "history_len",
            "type": "u64"
          },
          {
            "name": "history",
            "type": "vec<ProposalHistoryItem>"
          }
        ],
        "kind": "struct",
        "name": "UpgradeStatus",
        "typeTag": "17509548403608076983"
      },
      {
        "fields": [
          {
            "name": "app_id",
            "type": "u8"
          },
          {
            "name": "app",
            "type": "String"
          },
          {
            "name": "methods",
            "type": "vec<AvailableMethod>"
          }
        ],
        "kind": "struct",
        "name": "AppMethods",
        "typeTag": "9634447721182190540"
      },
      {
        "fields": [
          {
            "name": "name",
            "type": "String"
          },
          {
            "name": "discriminator",
            "type": "u16"
          },
          {
            "name": "view",
            "type": "bool"
          }
        ],
        "kind": "struct",
        "name": "AvailableMethod",
        "typeTag": "7468602417860735491"
      },
      {
        "fields": [
          {
            "name": "validator",
            "type": "B256"
          },
          {
            "name": "consensus_account",
            "type": "Address"
          },
          {
            "name": "consensus_pubkey",
            "type": "bytes"
          },
          {
            "name": "bls_pubkey",
            "type": "bytes"
          },
          {
            "name": "ed25519_pubkey",
            "type": "bytes"
          }
        ],
        "kind": "struct",
        "name": "ConsensusValidatorIdentity",
        "typeTag": "10024551326690382556"
      },
      {
        "fields": [
          {
            "name": "due_timestamp_ms",
            "type": "option<u64>"
          }
        ],
        "kind": "struct",
        "name": "WakeRecord",
        "typeTag": "14699626089141530756"
      },
      {
        "kind": "builtin",
        "name": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "kind": "builtin",
        "name": "B256",
        "typeTag": "12016729314829497160"
      },
      {
        "kind": "builtin",
        "name": "String",
        "typeTag": "8566531010829758022"
      },
      {
        "kind": "builtin",
        "name": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "kind": "builtin",
        "name": "bytes",
        "typeTag": "10405529814227927951"
      },
      {
        "kind": "builtin",
        "name": "u16",
        "typeTag": "5558799945458185151"
      },
      {
        "kind": "builtin",
        "name": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "kind": "builtin",
        "name": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "kind": "builtin",
        "name": "u8",
        "typeTag": "631772817358541784"
      }
    ],
    "resources": [
      {
        "name": "_ResourceAccountClaim",
        "type": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "name": "_EpochCommitment",
        "type": "B256",
        "typeTag": "12016729314829497160"
      },
      {
        "name": "_BlockSeed",
        "type": "B256",
        "typeTag": "12016729314829497160"
      },
      {
        "name": "_RecentBlockAnchor",
        "type": "RecentBlock",
        "typeTag": "14176988562306742379"
      },
      {
        "name": "_ActiveFeatures",
        "type": "vec<u64>",
        "typeTag": "1809461121837908103"
      },
      {
        "name": "_FeatureRecord",
        "type": "FeatureRecord",
        "typeTag": "7604164637852620690"
      },
      {
        "name": "_ChainParams",
        "type": "bytes",
        "typeTag": "10405529814227927951"
      },
      {
        "name": "_Proposal",
        "type": "Proposal",
        "typeTag": "7597941116962734961"
      },
      {
        "name": "_ProposalByKind",
        "type": "KindSlot",
        "typeTag": "7385424433979822081"
      },
      {
        "name": "_Vote",
        "type": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "name": "_VoteCount",
        "type": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "name": "_ProposalHistory",
        "type": "ProposalOutcome",
        "typeTag": "18173885799688015607"
      },
      {
        "name": "_ProposalHistoryLen",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_ProposalHistoryEntry",
        "type": "ProposalKey",
        "typeTag": "9879718488824214520"
      },
      {
        "name": "_ConsensusValidatorIdentity",
        "type": "ConsensusValidatorIdentity",
        "typeTag": "10024551326690382556"
      },
      {
        "name": "_ConsensusValidatorByAccount",
        "type": "B256",
        "typeTag": "14542707920151212342"
      },
      {
        "name": "_ConsensusValidatorByPubkey",
        "type": "B256",
        "typeTag": "14542707920151212342"
      },
      {
        "name": "_ConsensusValidatorByBls",
        "type": "B256",
        "typeTag": "14542707920151212342"
      },
      {
        "name": "_ConsensusValidatorByTransport",
        "type": "B256",
        "typeTag": "14542707920151212342"
      },
      {
        "name": "_AppWake",
        "type": "WakeRecord",
        "typeTag": "14699626089141530756"
      },
      {
        "name": "_WakeRegistry",
        "type": "bytes",
        "typeTag": "10405529814227927951"
      }
    ],
    "constants": [
      {
        "name": "BLOCK_SEED_RES_HINT",
        "type": "usize",
        "value": 2
      },
      {
        "name": "RECENT_BLOCK_WINDOW",
        "type": "u64",
        "value": 64
      },
      {
        "name": "STATUS_HISTORY",
        "type": "u64",
        "value": 32
      },
      {
        "name": "MAX_HISTORY_PAGE",
        "type": "u32",
        "value": 256
      }
    ],
    "errors": [
      {
        "code": 96,
        "message": "Randomness action failed: {0}",
        "name": "RandomnessFailure"
      },
      {
        "code": 97,
        "message": "System staking action failed: {0}",
        "name": "StakingFailure"
      },
      {
        "code": 98,
        "message": "Epoch clock action failed: {0}",
        "name": "EpochClockFailure"
      },
      {
        "code": 99,
        "message": "ValidatorSet action failed: {0}",
        "name": "ValidatorSetFailure"
      },
      {
        "code": 100,
        "message": "Block seed is not initialized",
        "name": "BlockSeedNotInitialized"
      },
      {
        "code": 101,
        "message": "Block seed is already initialized",
        "name": "BlockSeedAlreadyInitialized"
      },
      {
        "code": 102,
        "message": "Invalid random range {0}..{1}",
        "name": "InvalidRandomRange"
      },
      {
        "code": 103,
        "message": "App wake rejected",
        "name": "WakeRejected"
      },
      {
        "code": 104,
        "message": "Invalid feature id {0}",
        "name": "UpgradeInvalidFeatureId"
      },
      {
        "code": 105,
        "message": "Feature {0} is already active",
        "name": "UpgradeFeatureActive"
      },
      {
        "code": 106,
        "message": "Feature {0} already has a proposal in voting",
        "name": "UpgradeProposalExists"
      },
      {
        "code": 107,
        "message": "Another proposal of this kind is in voting",
        "name": "UpgradeKindBusy"
      },
      {
        "code": 108,
        "message": "A proposal just ended in this block; propose again from the next block",
        "name": "UpgradeResubmitNextBlock"
      },
      {
        "code": 109,
        "message": "Invalid chain params: {0}",
        "name": "UpgradeInvalidParams"
      },
      {
        "code": 110,
        "message": "No proposal in voting for feature {0}",
        "name": "UpgradeProposalNotFound"
      },
      {
        "code": 111,
        "message": "Voting period has ended",
        "name": "UpgradeVotingClosed"
      },
      {
        "code": 112,
        "message": "Validator has already voted",
        "name": "UpgradeAlreadyVoted"
      },
      {
        "code": 113,
        "message": "Only the proposer can cancel the proposal",
        "name": "UpgradeNotProposer"
      },
      {
        "code": 114,
        "message": "Only the trailing system transaction can close a vote",
        "name": "UpgradeSystemTxOnly"
      },
      {
        "code": 115,
        "message": "Upgrade state is corrupt: {0}",
        "name": "UpgradeStateCorrupt"
      }
    ]
  },
  {
    "metadata": {
      "app_id": 1,
      "name": "account",
      "description": "Milon account app IDL"
    },
    "instructions": [
      {
        "args": [
          {
            "name": "owner_pk",
            "role": "input",
            "type": "PublicKey"
          }
        ],
        "discriminator": 2182,
        "handler": "create",
        "kind": "entry",
        "name": "Create"
      },
      {
        "args": [
          {
            "name": "owner_pk",
            "role": "input",
            "type": "PublicKey"
          }
        ],
        "discriminator": 38184,
        "handler": "ensure_account",
        "kind": "entry",
        "name": "EnsureAccount"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "signers",
            "role": "input",
            "type": "vec<PublicKey>"
          },
          {
            "name": "weights",
            "role": "input",
            "type": "bytes"
          },
          {
            "name": "threshold",
            "role": "input",
            "type": "u8"
          }
        ],
        "discriminator": 20289,
        "handler": "create_multisig",
        "kind": "entry",
        "name": "CreateMultisig"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "signer_pk",
            "role": "input",
            "type": "PublicKey"
          },
          {
            "name": "weight",
            "role": "input",
            "type": "u8"
          }
        ],
        "discriminator": 41092,
        "handler": "add_signer",
        "kind": "entry",
        "name": "AddSigner"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "signer",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "weight",
            "role": "input",
            "type": "u8"
          }
        ],
        "discriminator": 30603,
        "handler": "add_signer_by_address",
        "kind": "entry",
        "name": "AddSignerByAddress"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "signers",
            "role": "input",
            "type": "vec<PublicKey>"
          },
          {
            "name": "weights",
            "role": "input",
            "type": "bytes"
          },
          {
            "name": "threshold",
            "role": "input",
            "type": "u8"
          }
        ],
        "discriminator": 25813,
        "handler": "add_signers",
        "kind": "entry",
        "name": "AddSigners"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "signers",
            "role": "input",
            "type": "vec<Address>"
          },
          {
            "name": "weights",
            "role": "input",
            "type": "bytes"
          },
          {
            "name": "threshold",
            "role": "input",
            "type": "u8"
          }
        ],
        "discriminator": 19656,
        "handler": "add_signers_by_address",
        "kind": "entry",
        "name": "AddSignersByAddress"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "index",
            "role": "input",
            "type": "u8"
          },
          {
            "name": "threshold",
            "role": "input",
            "type": "u8"
          }
        ],
        "discriminator": 61953,
        "handler": "remove_signer",
        "kind": "entry",
        "name": "RemoveSigner"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "threshold",
            "role": "input",
            "type": "u8"
          }
        ],
        "discriminator": 2386,
        "handler": "set_threshold",
        "kind": "entry",
        "name": "SetThreshold"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "index",
            "role": "input",
            "type": "u8"
          },
          {
            "name": "weight",
            "role": "input",
            "type": "u8"
          }
        ],
        "discriminator": 43270,
        "handler": "set_signer_weight",
        "kind": "entry",
        "name": "SetSignerWeight"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "any_signer",
            "type": "AnySigner"
          },
          {
            "name": "intent_hash",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "proposal",
            "role": "input",
            "type": "VoteProposal"
          }
        ],
        "discriminator": 52917,
        "handler": "vote_init",
        "kind": "entry",
        "name": "VoteInit"
      },
      {
        "args": [],
        "discriminator": 37954,
        "handler": "sweep_expired_votes",
        "kind": "entry",
        "name": "SweepExpiredVotes"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "any_signer",
            "type": "AnySigner"
          },
          {
            "name": "intent_hash",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 24406,
        "handler": "vote",
        "kind": "entry",
        "name": "Vote"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 11094,
        "handler": "get_account",
        "kind": "view",
        "name": "GetAccount",
        "returns": {
          "type": "Account"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 24766,
        "handler": "list_signers",
        "kind": "view",
        "name": "ListSigners",
        "returns": {
          "type": "tuple<Account,vec<tuple<PublicKey,u8,u8>>>"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "sig_bit",
            "role": "input",
            "type": "Bitmap64"
          },
          {
            "name": "policy",
            "role": "input",
            "type": "ResolvePolicy"
          }
        ],
        "discriminator": 27426,
        "handler": "resolve_signers",
        "kind": "view",
        "name": "ResolveSigners",
        "returns": {
          "type": "vec<PublicKey>"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "intent_hash",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 52139,
        "handler": "get_vote",
        "kind": "view",
        "name": "GetVote",
        "returns": {
          "type": "tuple<VoteMeta,Bitmap64,bool>"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 46107,
        "handler": "list_active_votes",
        "kind": "view",
        "name": "ListActiveVotes",
        "returns": {
          "type": "vec<tuple<VoteMeta,Bitmap64,bool>>"
        }
      }
    ],
    "types": [
      {
        "fields": [
          {
            "name": "bitmap",
            "type": "Bitmap64"
          },
          {
            "name": "weight",
            "type": "u8"
          },
          {
            "name": "threshold",
            "type": "u8"
          },
          {
            "name": "last_modified_block",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "Account",
        "typeTag": "4728916202331225981"
      },
      {
        "fields": [
          {
            "name": "pubkey",
            "type": "PublicKey"
          },
          {
            "name": "weight",
            "type": "u8"
          }
        ],
        "kind": "struct",
        "name": "AccountSigner",
        "typeTag": "18411492065370272939"
      },
      {
        "fields": [
          {
            "name": "min_signers",
            "type": "option<u32>"
          }
        ],
        "kind": "struct",
        "name": "ResolvePolicy",
        "typeTag": "15157821980119277780"
      },
      {
        "fields": [
          {
            "name": "instructions",
            "type": "vec<bytes>"
          },
          {
            "name": "auth_bit",
            "type": "Bitmap64"
          }
        ],
        "kind": "struct",
        "name": "VoteProposal",
        "typeTag": "13591436575871712325"
      },
      {
        "fields": [
          {
            "name": "intent_hash",
            "type": "B256"
          },
          {
            "name": "expires_at_ms",
            "type": "u64"
          },
          {
            "name": "source_tx_hash",
            "type": "B256"
          }
        ],
        "kind": "struct",
        "name": "VoteMeta",
        "typeTag": "17310772253093986646"
      },
      {
        "fields": [
          {
            "name": "bitmap",
            "type": "Bitmap64"
          },
          {
            "name": "sweep_expires_at_ms",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "VoteOccupancy",
        "typeTag": "3131795771474447668"
      },
      {
        "fields": [
          {
            "name": "expires_at_ms",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "Address"
          }
        ],
        "kind": "struct",
        "name": "VoteSweepOwner",
        "typeTag": "16828239814514078564"
      },
      {
        "kind": "builtin",
        "name": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "kind": "builtin",
        "name": "B256",
        "typeTag": "12016729314829497160"
      },
      {
        "kind": "builtin",
        "name": "Bitmap64",
        "typeTag": "6259351211094536142"
      },
      {
        "kind": "builtin",
        "name": "PublicKey",
        "typeTag": "12784977254987571496"
      },
      {
        "kind": "builtin",
        "name": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "kind": "builtin",
        "name": "bytes",
        "typeTag": "10405529814227927951"
      },
      {
        "kind": "builtin",
        "name": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "kind": "builtin",
        "name": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "kind": "builtin",
        "name": "u8",
        "typeTag": "631772817358541784"
      }
    ],
    "resources": [
      {
        "name": "_Account",
        "type": "Account",
        "typeTag": "4728916202331225981"
      },
      {
        "name": "_AccountSigner",
        "type": "AccountSigner",
        "typeTag": "18411492065370272939"
      },
      {
        "name": "_VoteProgress",
        "type": "Bitmap64",
        "typeTag": "6259351211094536142"
      },
      {
        "name": "_VoteOccupancy",
        "type": "VoteOccupancy",
        "typeTag": "3131795771474447668"
      },
      {
        "name": "_VoteSlot",
        "type": "VoteMeta",
        "typeTag": "17310772253093986646"
      },
      {
        "name": "_VoteSweepShard",
        "type": "vec<VoteSweepOwner>",
        "typeTag": "5617274569088890347"
      },
      {
        "name": "_VoteSweepShards",
        "type": "bytes",
        "typeTag": "10405529814227927951"
      }
    ],
    "constants": [
      {
        "name": "MAX_SIGNER_INDEX",
        "type": "u8",
        "value": 64
      },
      {
        "name": "MAX_TOTAL_WEIGHT",
        "type": "u8",
        "value": 255
      },
      {
        "name": "MAX_ACTIVE_VOTES",
        "type": "usize",
        "value": 64
      },
      {
        "name": "MAX_VOTE_TTL_MS",
        "type": "u64",
        "value": "24 * 3_600_000"
      },
      {
        "name": "VOTE_SWEEP_FEE",
        "type": "u64",
        "value": 100000
      },
      {
        "name": "VOTE_SWEEP_SPONSOR_SEED",
        "type": "u64",
        "value": 1
      },
      {
        "name": "MAX_VOTE_PROPOSAL_BYTES",
        "type": "usize",
        "value": 1024
      }
    ],
    "errors": [
      {
        "code": 256,
        "message": "Account: {0:?} not found",
        "name": "AccountNotFound"
      },
      {
        "code": 257,
        "message": "Account: {0:?} already exists",
        "name": "AccountAlreadyExists"
      },
      {
        "code": 258,
        "message": "Signer index already occupied",
        "name": "SignerAlreadyExists"
      },
      {
        "code": 259,
        "message": "Signer at index {0} not found",
        "name": "SignerNotFound"
      },
      {
        "code": 260,
        "message": "Signer count out of range: {0}",
        "name": "SignerNumberOutOfRange"
      },
      {
        "code": 261,
        "message": "Signer index out of range: {0}",
        "name": "SignerIndexOutOfRange"
      },
      {
        "code": 262,
        "message": "Signer weight {0} is invalid",
        "name": "SignerWeightInvalid"
      },
      {
        "code": 263,
        "message": "Total signer weight {0} exceeds 1...255",
        "name": "WeightSumExceeded"
      },
      {
        "code": 264,
        "message": "signers and weights length mismatch",
        "name": "WeightsLengthMismatch"
      },
      {
        "code": 265,
        "message": "Threshold {0} is incorrect",
        "name": "ThresholdIncorrect"
      },
      {
        "code": 266,
        "message": "sig_bit is empty",
        "name": "SigBitEmpty"
      },
      {
        "code": 267,
        "message": "Signature bit out of range: index {0}",
        "name": "SignatureBitOutOfRange"
      },
      {
        "code": 268,
        "message": "Insufficient signer weight: got {0}, need {1}",
        "name": "InsufficientSignerWeight"
      },
      {
        "code": 269,
        "message": "Too few signers in sig_bit: got {0}, need {1}",
        "name": "SigBitTooFew"
      },
      {
        "code": 270,
        "message": "Signature count mismatch: expected {0}, got {1}",
        "name": "SignatureCountMismatch"
      },
      {
        "code": 271,
        "message": "Invalid signature",
        "name": "SignatureInvalid"
      },
      {
        "code": 272,
        "message": "Keyless session signature verification failed for account: {0:?}",
        "name": "KeylessSessionVerifyFailed"
      },
      {
        "code": 273,
        "message": "Invalid public key",
        "name": "InvalidPublicKey"
      },
      {
        "code": 274,
        "message": "Account is not a multisig account",
        "name": "AccountNotMultisig"
      },
      {
        "code": 275,
        "message": "expires_at_ms must be greater than tx stamp",
        "name": "ExpiresAtInvalid"
      },
      {
        "code": 276,
        "message": "Vote intent expired",
        "name": "VoteExpired"
      },
      {
        "code": 277,
        "message": "Vote not ready for replay",
        "name": "VoteNotReady"
      },
      {
        "code": 278,
        "message": "Vote expires_at_ms does not match registered intent",
        "name": "VoteExpiresMismatch"
      },
      {
        "code": 279,
        "message": "Vote active intent index full (max 8)",
        "name": "VoteIndexFull"
      },
      {
        "code": 280,
        "message": "Vote TTL exceeds 24 hours",
        "name": "VoteTtlExceeded"
      },
      {
        "code": 281,
        "message": "Vote proposal does not match intent_hash",
        "name": "VoteProposalMismatch"
      },
      {
        "code": 282,
        "message": "Vote proposal wire exceeds size limit",
        "name": "VoteProposalTooLarge"
      },
      {
        "code": 283,
        "message": "Vote proposal wire is invalid",
        "name": "VoteProposalInvalid"
      },
      {
        "code": 284,
        "message": "Account {0:?} exists; pubkey mode not allowed",
        "name": "PubkeyModeForbidden"
      },
      {
        "code": 285,
        "message": "Vote sweep fee balance insufficient",
        "name": "VoteSweepFeeInsufficient"
      },
      {
        "code": 286,
        "message": "Vote wake registration rejected",
        "name": "VoteWakeRejected"
      },
      {
        "code": 287,
        "message": "App-reserved address {0:?} cannot register or authenticate an account",
        "name": "ReservedAppAddress"
      },
      {
        "code": 288,
        "message": "Address {0:?} index 0 is not the public key that derives it",
        "name": "SignerAddressKeyMismatch"
      }
    ]
  },
  {
    "metadata": {
      "app_id": 2,
      "name": "token",
      "description": "Milon token app IDL"
    },
    "instructions": [
      {
        "args": [
          {
            "name": "token",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "metadata",
            "role": "input",
            "type": "Metadata"
          }
        ],
        "discriminator": 2581,
        "handler": "create",
        "kind": "entry",
        "name": "Create"
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 64710,
        "handler": "abandon_owner",
        "kind": "entry",
        "name": "AbandonOwner",
        "signer_lookups": {
          "owner": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 241
          }
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "to",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 18518,
        "handler": "transfer_owner",
        "kind": "entry",
        "name": "TransferOwner",
        "signer_lookups": {
          "owner": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 241
          }
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 1778,
        "handler": "abandon_freezer",
        "kind": "entry",
        "name": "AbandonFreezer",
        "signer_lookups": {
          "freezer": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 149
          }
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "to",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 27042,
        "handler": "transfer_freezer",
        "kind": "entry",
        "name": "TransferFreezer",
        "signer_lookups": {
          "freezer": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 149
          }
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "to",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 20481,
        "handler": "mint",
        "kind": "entry",
        "name": "Mint",
        "signer_lookups": {
          "owner": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 241
          }
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "to",
            "role": "input",
            "type": "vec<Address>"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "vec<u64>"
          }
        ],
        "discriminator": 7494,
        "handler": "mint_batch",
        "kind": "entry",
        "name": "MintBatch",
        "signer_lookups": {
          "owner": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 241
          }
        }
      },
      {
        "args": [
          {
            "name": "holder",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 38784,
        "handler": "burn",
        "kind": "entry",
        "name": "Burn"
      },
      {
        "args": [
          {
            "name": "from",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "to",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 19694,
        "handler": "transfer",
        "kind": "entry",
        "name": "Transfer"
      },
      {
        "args": [
          {
            "name": "from",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "to",
            "role": "input",
            "type": "vec<Address>"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "vec<u64>"
          }
        ],
        "discriminator": 28053,
        "handler": "transfer_batch",
        "kind": "entry",
        "name": "TransferBatch"
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "holder",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 31050,
        "handler": "freeze",
        "kind": "entry",
        "name": "Freeze",
        "signer_lookups": {
          "freezer": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 149
          }
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "holder",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 17977,
        "handler": "unfreeze",
        "kind": "entry",
        "name": "Unfreeze",
        "signer_lookups": {
          "freezer": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 149
          }
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "spender",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 9714,
        "handler": "approve",
        "kind": "entry",
        "name": "Approve"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "spender",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 8619,
        "handler": "revoke",
        "kind": "entry",
        "name": "Revoke"
      },
      {
        "args": [
          {
            "name": "spender",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "from",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 18655,
        "handler": "transfer_from",
        "kind": "entry",
        "name": "TransferFrom"
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "icon_url",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 40941,
        "handler": "set_icon",
        "kind": "entry",
        "name": "SetIcon",
        "signer_lookups": {
          "owner": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 241
          }
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "uri",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 52758,
        "handler": "set_uri",
        "kind": "entry",
        "name": "SetUri",
        "signer_lookups": {
          "owner": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 241
          }
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "account",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 59285,
        "handler": "balance_of",
        "kind": "view",
        "name": "BalanceOf",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "account",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 64893,
        "handler": "frozen_of",
        "kind": "view",
        "name": "FrozenOf",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "spender",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 43638,
        "handler": "approval_of",
        "kind": "view",
        "name": "ApprovalOf",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 35429,
        "handler": "total_supply",
        "kind": "view",
        "name": "TotalSupply",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 7880,
        "handler": "metadata",
        "kind": "view",
        "name": "Metadata",
        "returns": {
          "type": "Metadata"
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "metadata",
            "role": "input",
            "type": "Metadata"
          },
          {
            "name": "credential_id",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 62196,
        "handler": "create_with_compliance",
        "kind": "entry",
        "name": "CreateWithCompliance"
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "mode",
            "role": "input",
            "type": "ComplianceMode"
          }
        ],
        "discriminator": 33931,
        "handler": "set_compliance_mode",
        "kind": "entry",
        "name": "SetComplianceMode",
        "signer_lookups": {
          "owner": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 241
          }
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "credential_ids",
            "role": "input",
            "type": "vec<String>"
          }
        ],
        "discriminator": 59302,
        "handler": "add_compliance_requirement",
        "kind": "entry",
        "name": "AddComplianceRequirement",
        "signer_lookups": {
          "owner": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 241
          }
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "credential_ids",
            "role": "input",
            "type": "vec<String>"
          }
        ],
        "discriminator": 14909,
        "handler": "remove_compliance_requirement",
        "kind": "entry",
        "name": "RemoveComplianceRequirement",
        "signer_lookups": {
          "owner": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 241
          }
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 50437,
        "handler": "clear_compliance_requirements",
        "kind": "entry",
        "name": "ClearComplianceRequirements",
        "signer_lookups": {
          "owner": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 241
          }
        }
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "issuer",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "issuer_key_id",
            "role": "input",
            "type": "u8"
          },
          {
            "name": "credential_schema",
            "role": "input",
            "type": "String"
          },
          {
            "name": "credential_hash",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "valid_until_ms",
            "role": "input",
            "type": "option<u64>"
          },
          {
            "name": "issuer_signature",
            "role": "input",
            "type": "Signature"
          }
        ],
        "discriminator": 39942,
        "handler": "disclose_token_vc_attestation",
        "kind": "entry",
        "name": "DiscloseTokenVcAttestation",
        "signer_lookups": {
          "owner": {
            "path": {
              "arg": "token",
              "type": "Address"
            },
            "res": 241
          }
        }
      },
      {
        "args": [
          {
            "name": "claimer",
            "role": "signer",
            "type": "Signer"
          }
        ],
        "discriminator": 63796,
        "handler": "claim_faucet",
        "kind": "entry",
        "name": "ClaimFaucet",
        "sponsor": true
      },
      {
        "args": [
          {
            "name": "creator",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "total_amount",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "claim_count",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "rules",
            "role": "input",
            "type": "HongbaoRules"
          },
          {
            "name": "message",
            "role": "input",
            "type": "option<String>"
          }
        ],
        "discriminator": 56849,
        "handler": "create_equal_hongbao",
        "kind": "entry",
        "name": "CreateEqualHongbao"
      },
      {
        "args": [
          {
            "name": "creator",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "total_amount",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "claim_count",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "rules",
            "role": "input",
            "type": "HongbaoRules"
          },
          {
            "name": "message",
            "role": "input",
            "type": "option<String>"
          }
        ],
        "discriminator": 32577,
        "handler": "create_lucky_hongbao",
        "kind": "entry",
        "name": "CreateLuckyHongbao"
      },
      {
        "args": [
          {
            "name": "creator",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "total_amount",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "claim_count",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "allocation",
            "role": "input",
            "type": "HongbaoAllocation"
          },
          {
            "name": "credential_ids",
            "role": "input",
            "type": "vec<String>"
          },
          {
            "name": "expires_at_ms",
            "role": "input",
            "type": "option<u64>"
          },
          {
            "name": "message",
            "role": "input",
            "type": "option<String>"
          }
        ],
        "discriminator": 38296,
        "handler": "create_credential_hongbao",
        "kind": "entry",
        "name": "CreateCredentialHongbao"
      },
      {
        "args": [
          {
            "name": "creator",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "total_amount",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "claim_count",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "allocation",
            "role": "input",
            "type": "HongbaoAllocation"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "min_amount",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "expires_at_ms",
            "role": "input",
            "type": "option<u64>"
          },
          {
            "name": "message",
            "role": "input",
            "type": "option<String>"
          }
        ],
        "discriminator": 18018,
        "handler": "create_sft_hongbao",
        "kind": "entry",
        "name": "CreateSftHongbao"
      },
      {
        "args": [
          {
            "name": "claimant",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "hongbao_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 46748,
        "handler": "claim_hongbao",
        "kind": "entry",
        "name": "ClaimHongbao",
        "sponsor": true
      },
      {
        "args": [
          {
            "name": "hongbao_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 51292,
        "handler": "refund_hongbao",
        "kind": "entry",
        "name": "RefundHongbao"
      },
      {
        "args": [
          {
            "name": "hongbao_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 55222,
        "handler": "schedule_hongbao_refund",
        "kind": "entry",
        "name": "ScheduleHongbaoRefund"
      },
      {
        "args": [
          {
            "name": "hongbao_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 44896,
        "handler": "run_hongbao_refund",
        "kind": "entry",
        "name": "RunHongbaoRefund",
        "sponsor": true
      },
      {
        "args": [
          {
            "name": "hongbao_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 43410,
        "handler": "run_hongbao_cleanup",
        "kind": "entry",
        "name": "RunHongbaoCleanup",
        "sponsor": true
      },
      {
        "args": [
          {
            "name": "creator",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "start_at_ms",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "recipients",
            "role": "input",
            "type": "vec<VestingRecipient>"
          }
        ],
        "discriminator": 47760,
        "handler": "create_vesting",
        "kind": "entry",
        "name": "CreateVesting"
      },
      {
        "args": [
          {
            "name": "claimant",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "vesting_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 14230,
        "handler": "claim_vesting",
        "kind": "entry",
        "name": "ClaimVesting",
        "sponsor": true
      },
      {
        "args": [
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 43186,
        "handler": "compliance",
        "kind": "view",
        "name": "Compliance",
        "returns": {
          "type": "Compliance"
        }
      },
      {
        "args": [
          {
            "name": "account",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 29892,
        "handler": "faucet_cooldown_remaining",
        "kind": "view",
        "name": "FaucetCooldownRemaining",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "hongbao_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 30775,
        "handler": "hongbao_message",
        "kind": "view",
        "name": "HongbaoMessage",
        "returns": {
          "type": "String"
        }
      },
      {
        "args": [
          {
            "name": "hongbao_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 4156,
        "handler": "hongbao_info",
        "kind": "view",
        "name": "HongbaoInfo",
        "returns": {
          "type": "HongbaoState"
        }
      },
      {
        "args": [
          {
            "name": "hongbao_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 56611,
        "handler": "hongbao_settlement",
        "kind": "view",
        "name": "HongbaoSettlement",
        "returns": {
          "type": "HongbaoSettlement"
        }
      },
      {
        "args": [
          {
            "name": "hongbao_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "claimant",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 5289,
        "handler": "can_claim_hongbao",
        "kind": "view",
        "name": "CanClaimHongbao",
        "returns": {
          "type": "bool"
        }
      },
      {
        "args": [
          {
            "name": "vesting_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 14246,
        "handler": "vesting_info",
        "kind": "view",
        "name": "VestingInfo",
        "returns": {
          "type": "VestingState"
        }
      },
      {
        "args": [
          {
            "name": "vesting_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "recipient",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 6878,
        "handler": "vesting_claimable",
        "kind": "view",
        "name": "VestingClaimable",
        "returns": {
          "type": "u64"
        }
      }
    ],
    "types": [
      {
        "fields": [
          {
            "name": "name",
            "type": "String"
          },
          {
            "name": "symbol",
            "type": "String"
          },
          {
            "name": "decimals",
            "type": "u8"
          },
          {
            "name": "icon",
            "type": "String"
          },
          {
            "name": "uri",
            "type": "String"
          }
        ],
        "kind": "struct",
        "name": "Metadata",
        "typeTag": "12540935430733747277"
      },
      {
        "kind": "enum",
        "name": "ComplianceMode",
        "typeTag": "11826989465527443636",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "All"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Any"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "mode",
            "type": "ComplianceMode"
          },
          {
            "name": "requirements",
            "type": "vec<String>"
          }
        ],
        "kind": "struct",
        "name": "Compliance",
        "typeTag": "11316838900449406443"
      },
      {
        "kind": "enum",
        "name": "HongbaoAllocation",
        "typeTag": "12559390919027217581",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Equal"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Lucky"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "HongbaoEligibility",
        "typeTag": "7147486567772066656",
        "variants": [
          {
            "fields": [
              {
                "name": "credential_id",
                "type": "String"
              }
            ],
            "kind": "struct",
            "name": "Credential"
          },
          {
            "fields": [
              {
                "name": "addresses",
                "type": "vec<Address>"
              }
            ],
            "kind": "struct",
            "name": "Recipients"
          },
          {
            "fields": [
              {
                "name": "sft",
                "type": "Address"
              },
              {
                "name": "min_amount",
                "type": "u64"
              }
            ],
            "kind": "struct",
            "name": "SftHolding"
          },
          {
            "fields": [
              {
                "name": "credential_ids",
                "type": "vec<String>"
              }
            ],
            "kind": "struct",
            "name": "Credentials"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "credential_id",
            "type": "option<String>"
          },
          {
            "name": "recipients",
            "type": "vec<Address>"
          },
          {
            "name": "expires_at_ms",
            "type": "option<u64>"
          }
        ],
        "kind": "struct",
        "name": "HongbaoRules",
        "typeTag": "15766145922554532178"
      },
      {
        "fields": [
          {
            "name": "creator",
            "type": "Address"
          },
          {
            "name": "hongbao_id",
            "type": "Address"
          },
          {
            "name": "token",
            "type": "Address"
          },
          {
            "name": "total_amount",
            "type": "u64"
          },
          {
            "name": "remaining_amount",
            "type": "u64"
          },
          {
            "name": "claim_count",
            "type": "u64"
          },
          {
            "name": "claimed_count",
            "type": "u64"
          },
          {
            "name": "expires_at_ms",
            "type": "u64"
          },
          {
            "name": "allocation",
            "type": "HongbaoAllocation"
          },
          {
            "name": "eligibility",
            "type": "HongbaoEligibility"
          },
          {
            "name": "claimed_recipients",
            "type": "u32"
          }
        ],
        "kind": "struct",
        "name": "HongbaoState",
        "typeTag": "8047344484983905260"
      },
      {
        "fields": [
          {
            "name": "creator",
            "type": "Address"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "claim_records",
            "type": "u64"
          },
          {
            "name": "cleanup_cursor",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "HongbaoSettlement",
        "typeTag": "373282345846871664"
      },
      {
        "fields": [
          {
            "name": "head",
            "type": "Address"
          },
          {
            "name": "tail",
            "type": "Address"
          }
        ],
        "kind": "struct",
        "name": "HongbaoCleanupQueueState",
        "typeTag": "5496675755488506181"
      },
      {
        "fields": [
          {
            "name": "due",
            "type": "u64"
          },
          {
            "name": "hongbao_id",
            "type": "Address"
          }
        ],
        "kind": "struct",
        "name": "HongbaoRefundTask",
        "typeTag": "2796899193011756712"
      },
      {
        "fields": [
          {
            "name": "recipient",
            "type": "Address"
          },
          {
            "name": "name",
            "type": "String"
          },
          {
            "name": "total_amount",
            "type": "u64"
          },
          {
            "name": "initial_period_seconds",
            "type": "u64"
          },
          {
            "name": "initial_amount",
            "type": "u64"
          },
          {
            "name": "period_seconds",
            "type": "u64"
          },
          {
            "name": "periods",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "VestingRecipient",
        "typeTag": "11383286172959698066"
      },
      {
        "fields": [
          {
            "name": "vesting_id",
            "type": "Address"
          },
          {
            "name": "creator",
            "type": "Address"
          },
          {
            "name": "token",
            "type": "Address"
          },
          {
            "name": "start_at_ms",
            "type": "u64"
          },
          {
            "name": "recipients",
            "type": "vec<VestingRecipient>"
          },
          {
            "name": "claimed_amounts",
            "type": "vec<u64>"
          },
          {
            "name": "total_amount",
            "type": "u64"
          },
          {
            "name": "remaining_amount",
            "type": "u64"
          },
          {
            "name": "gas_budget",
            "type": "u64"
          },
          {
            "name": "gas_refunded",
            "type": "bool"
          },
          {
            "name": "seed",
            "type": "B256"
          }
        ],
        "kind": "struct",
        "name": "VestingState",
        "typeTag": "5151897875976358800"
      },
      {
        "kind": "builtin",
        "name": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "kind": "builtin",
        "name": "B256",
        "typeTag": "12016729314829497160"
      },
      {
        "kind": "builtin",
        "name": "Signature",
        "typeTag": "9480777115032900864"
      },
      {
        "kind": "builtin",
        "name": "String",
        "typeTag": "8566531010829758022"
      },
      {
        "kind": "builtin",
        "name": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "kind": "builtin",
        "name": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "kind": "builtin",
        "name": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "kind": "builtin",
        "name": "u8",
        "typeTag": "631772817358541784"
      }
    ],
    "resources": [
      {
        "name": "_Owner",
        "type": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "name": "_Freezer",
        "type": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "name": "_Metadata",
        "type": "Metadata",
        "typeTag": "12540935430733747277"
      },
      {
        "name": "_TotalSupply",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Balance",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Frozen",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Approval",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_AppHold",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Compliance",
        "type": "Compliance",
        "typeTag": "11316838900449406443"
      },
      {
        "name": "_FaucetLastClaim",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_HongbaoMessage",
        "type": "String",
        "typeTag": "8566531010829758022"
      },
      {
        "name": "_Hongbao",
        "type": "HongbaoState",
        "typeTag": "8047344484983905260"
      },
      {
        "name": "_HongbaoUsed",
        "type": "B256",
        "typeTag": "12016729314829497160"
      },
      {
        "name": "_HongbaoClaimed",
        "type": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "name": "_HongbaoClaimIndex",
        "type": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "name": "_HongbaoSettlement",
        "type": "HongbaoSettlement",
        "typeTag": "373282345846871664"
      },
      {
        "name": "_HongbaoCleanupQueue",
        "type": "HongbaoCleanupQueueState",
        "typeTag": "5496675755488506181"
      },
      {
        "name": "_HongbaoCleanupNext",
        "type": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "name": "_HongbaoClaimApp",
        "type": "u8",
        "typeTag": "631772817358541784"
      },
      {
        "name": "_HongbaoRefundHeapSize",
        "type": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "name": "_HongbaoRefundTask",
        "type": "HongbaoRefundTask",
        "typeTag": "2796899193011756712"
      },
      {
        "name": "_HongbaoRefundSlot",
        "type": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "name": "_HongbaoCleanupDue",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Vesting",
        "type": "VestingState",
        "typeTag": "5151897875976358800"
      },
      {
        "name": "_TokenVesting",
        "type": "Address",
        "typeTag": "17438174819379414968"
      }
    ],
    "constants": [
      {
        "name": "MIL_TOKEN",
        "type": "Address",
        "value": "Address { digest : [0x18 , 0xC0 , 0x6A , 0x68 , 0x95 , 0x94 , 0x2A , 0x9A , 0xF0 , 0x19 , 0x1B , 0x02 , 0x32 , 0x46 , 0x2D , 0x6F , 0x7C , 0x40 , 0x00 , 0x00 ,] , }"
      },
      {
        "name": "MIL_TOKEN_ADDRESS",
        "type": "str",
        "value": "M11on1111111111111111111111"
      },
      {
        "name": "GAS_SPONSOR_SEED",
        "type": "u64",
        "value": 1
      },
      {
        "name": "FAUCET_AMOUNT",
        "type": "u64",
        "value": "1 * 1_000_000"
      },
      {
        "name": "FAUCET_COOLDOWN_MS",
        "type": "u64",
        "value": 86400000
      },
      {
        "name": "GAS_SPONSOR_MINT",
        "type": "u64",
        "value": "1_000_000 * 1_000_000"
      },
      {
        "name": "MAX_HONGBAO_CLAIMS",
        "type": "u64",
        "value": 1024
      },
      {
        "name": "HONGBAO_FEE_PER_CLAIM",
        "type": "u64",
        "value": 100000
      },
      {
        "name": "MAX_HONGBAO_RECIPIENTS",
        "type": "usize",
        "value": 32
      },
      {
        "name": "MAX_HONGBAO_CREDENTIALS",
        "type": "usize",
        "value": 8
      },
      {
        "name": "DEFAULT_HONGBAO_EXPIRATION_MS",
        "type": "u64",
        "value": 86400000
      },
      {
        "name": "HONGBAO_CLEANUP_BATCH",
        "type": "u64",
        "value": 64
      },
      {
        "name": "MAX_HONGBAO_MESSAGE_BYTES",
        "type": "usize",
        "value": 64
      },
      {
        "name": "HONGBAO_CLEANUP_INTERVAL_MS",
        "type": "u64",
        "value": 1000
      },
      {
        "name": "MAX_VESTING_RECIPIENTS",
        "type": "usize",
        "value": 20
      },
      {
        "name": "VESTING_FEE_PER_CLAIM",
        "type": "u64",
        "value": 100000
      },
      {
        "name": "VESTING_SETTLEMENT_RESERVE",
        "type": "u64",
        "value": 100000
      }
    ],
    "events": [
      {
        "fields": [
          {
            "indexed": true,
            "name": "hongbao_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "creator",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "token",
            "type": "Address"
          }
        ],
        "name": "HongbaoCreated",
        "typeTag": "5552105765182429402"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "hongbao_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "creator",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "token",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          }
        ],
        "name": "HongbaoRefunded",
        "typeTag": "1205551104664398759"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "vesting_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "creator",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "token",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "total_amount",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "gas_budget",
            "type": "u64"
          }
        ],
        "name": "VestingCreated",
        "typeTag": "15060776178379885906"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "vesting_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "recipient",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "claimed_amount",
            "type": "u64"
          }
        ],
        "name": "VestingClaimed",
        "typeTag": "13484328491781583963"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "vesting_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "creator",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          }
        ],
        "name": "VestingGasRefunded",
        "typeTag": "4140942304272679532"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "token",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "to",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          }
        ],
        "name": "Mint",
        "typeTag": "2074136101726433888"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "token",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "holder",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          }
        ],
        "name": "Burn",
        "typeTag": "17989347192277165893"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "payer",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "token",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          }
        ],
        "name": "GasCharged",
        "typeTag": "15206978723640898879"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "token",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "from",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "to",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          }
        ],
        "name": "Transfer",
        "typeTag": "8500236251342700043"
      }
    ],
    "errors": [
      {
        "code": 512,
        "message": "account does not exist (token: {0:?}, account: {1:?})",
        "name": "AccountNotFound"
      },
      {
        "code": 513,
        "message": "insufficient balance (token: {0:?}, account: {1:?}, available: {2}, required: {3})",
        "name": "InsufficientBalance"
      },
      {
        "code": 514,
        "message": "insufficient allowance (token: {0:?}, owner: {1:?}, spender: {2:?}, available: {3}, required: {4})",
        "name": "InsufficientApproval"
      },
      {
        "code": 515,
        "message": "token does not exist (token: {0:?})",
        "name": "TokenNotFound"
      },
      {
        "code": 516,
        "message": "token already exists (token: {0:?})",
        "name": "TokenAlreadyExists"
      },
      {
        "code": 517,
        "message": "Overflow in: {0} + {1} > {2}",
        "name": "Overflow"
      },
      {
        "code": 518,
        "message": "Underflow in: {0} - {1} < {2}",
        "name": "Underflow"
      },
      {
        "code": 519,
        "message": "Invalid parameters: {0}",
        "name": "InvalidParameters"
      },
      {
        "code": 520,
        "message": "VC `{3}` from issuer {2:?} required for token recipient (token: {0:?}, recipient: {1:?})",
        "name": "VcRequired"
      },
      {
        "code": 521,
        "message": "VC policy required for token recipient (token: {0:?}, recipient: {1:?})",
        "name": "VcPolicyRequired"
      },
      {
        "code": 522,
        "message": "faucet is disabled on this chain",
        "name": "FaucetDisabled"
      },
      {
        "code": 523,
        "message": "faucet cooldown active ({0} ms remaining)",
        "name": "FaucetCooldownActive"
      },
      {
        "code": 524,
        "message": "hongbao not found: {0:?}",
        "name": "HongbaoNotFound"
      },
      {
        "code": 525,
        "message": "hongbao id already used: {0:?}",
        "name": "HongbaoAlreadyExists"
      },
      {
        "code": 526,
        "message": "hongbao expired: {0:?}",
        "name": "HongbaoExpired"
      },
      {
        "code": 527,
        "message": "hongbao is not expired: {0:?}",
        "name": "HongbaoNotExpired"
      },
      {
        "code": 528,
        "message": "hongbao is still active: {0:?}",
        "name": "HongbaoStillActive"
      },
      {
        "code": 529,
        "message": "invalid hongbao definition: {0}",
        "name": "InvalidHongbaoDefinition"
      },
      {
        "code": 530,
        "message": "hongbao claimant is not eligible: {0:?}",
        "name": "HongbaoNotEligible"
      },
      {
        "code": 531,
        "message": "hongbao already claimed by: {0:?}",
        "name": "HongbaoAlreadyClaimed"
      },
      {
        "code": 532,
        "message": "hongbao escrow invariant violated: {0:?}",
        "name": "HongbaoEscrowInvariantViolation"
      },
      {
        "code": 533,
        "message": "secure randomness unavailable: {0}",
        "name": "HongbaoRandomnessUnavailable"
      },
      {
        "code": 534,
        "message": "hongbao cleanup wake rejected",
        "name": "HongbaoCleanupWakeRejected"
      },
      {
        "code": 535,
        "message": "Transparent IdentityError",
        "name": "IdentityError",
        "transparent": true
      },
      {
        "code": 536,
        "message": "delivery rejected for {0:?}: {1}",
        "name": "DeliveryRejected"
      },
      {
        "code": 537,
        "message": "invalid vesting definition: {0}",
        "name": "InvalidVestingDefinition"
      },
      {
        "code": 538,
        "message": "vesting not found: {0:?}",
        "name": "VestingNotFound"
      },
      {
        "code": 539,
        "message": "vesting id already used: {0:?}",
        "name": "VestingAlreadyExists"
      },
      {
        "code": 540,
        "message": "vesting recipient not eligible: {0:?}",
        "name": "VestingNotEligible"
      },
      {
        "code": 541,
        "message": "vesting has no claimable amount",
        "name": "VestingNothingClaimable"
      },
      {
        "code": 542,
        "message": "vesting creator must be token owner",
        "name": "VestingOwnerRequired"
      },
      {
        "code": 543,
        "message": "vesting escrow invariant violated: {0:?}",
        "name": "VestingEscrowInvariantViolation"
      },
      {
        "code": 544,
        "message": "Transparent SftError",
        "name": "SftError",
        "transparent": true
      }
    ]
  },
  {
    "metadata": {
      "app_id": 3,
      "name": "staking",
      "description": "Milon staking app IDL"
    },
    "instructions": [
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "nonce",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "stake_asset",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "reward_asset",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "cycle_config",
            "role": "input",
            "type": "PoolCycleConfig"
          },
          {
            "name": "reward_config",
            "role": "input",
            "type": "PoolRewardConfig"
          }
        ],
        "discriminator": 52671,
        "handler": "create_pool",
        "kind": "entry",
        "name": "CreatePool",
        "returns": {
          "type": "B256"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 55077,
        "handler": "pause_pool",
        "kind": "entry",
        "name": "PausePool"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 55138,
        "handler": "resume_pool",
        "kind": "entry",
        "name": "ResumePool"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 40303,
        "handler": "close_pool",
        "kind": "entry",
        "name": "ClosePool"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 51163,
        "handler": "sweep_pool_residual",
        "kind": "entry",
        "name": "SweepPoolResidual",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 65380,
        "handler": "stake_into_pool",
        "kind": "entry",
        "name": "StakeIntoPool"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "effective_cycle",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 26203,
        "handler": "cancel_pending_stake",
        "kind": "entry",
        "name": "CancelPendingStake"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 34861,
        "handler": "request_unstake",
        "kind": "entry",
        "name": "RequestUnstake"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "effective_cycle",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 53570,
        "handler": "cancel_unstake",
        "kind": "entry",
        "name": "CancelUnstake"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 35421,
        "handler": "claim_principal",
        "kind": "entry",
        "name": "ClaimPrincipal",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 49863,
        "handler": "claim_rewards",
        "kind": "entry",
        "name": "ClaimRewards",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "asset",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 13164,
        "handler": "claim_asset_rewards",
        "kind": "entry",
        "name": "ClaimAssetRewards",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "funder",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 61672,
        "handler": "accrue_pool_reward",
        "kind": "entry",
        "name": "AccruePoolReward"
      },
      {
        "args": [
          {
            "name": "recipient",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 39476,
        "handler": "claim_commission",
        "kind": "entry",
        "name": "ClaimCommission",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 17449,
        "handler": "claim_pool_commission",
        "kind": "entry",
        "name": "ClaimPoolCommission",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "config",
            "role": "input",
            "type": "PoolRewardConfig"
          }
        ],
        "discriminator": 37925,
        "handler": "request_pool_reward_config",
        "kind": "entry",
        "name": "RequestPoolRewardConfig"
      },
      {
        "args": [
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 60310,
        "handler": "pool",
        "kind": "view",
        "name": "Pool",
        "returns": {
          "type": "Pool"
        }
      },
      {
        "args": [
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 11487,
        "handler": "total_stake",
        "kind": "view",
        "name": "TotalStake",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 65179,
        "handler": "position",
        "kind": "view",
        "name": "Position",
        "returns": {
          "type": "Position"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 18235,
        "handler": "asset_rewards",
        "kind": "view",
        "name": "AssetRewards",
        "returns": {
          "type": "map<Address,AssetReward>"
        }
      },
      {
        "args": [
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 309,
        "handler": "pool_treasury_balance",
        "kind": "view",
        "name": "PoolTreasuryBalance",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "pool_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "recipient",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 51494,
        "handler": "commission_balance",
        "kind": "view",
        "name": "CommissionBalance",
        "returns": {
          "type": "u64"
        }
      }
    ],
    "types": [
      {
        "kind": "enum",
        "name": "PoolStatus",
        "typeTag": "11829355056571301769",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Open"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Paused"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Closing"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Drained"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "CycleBasis",
        "typeTag": "7099687035361895509",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Epoch"
          },
          {
            "fields": [
              {
                "name": "anchor_block",
                "type": "u64"
              },
              {
                "name": "length_blocks",
                "type": "u64"
              }
            ],
            "kind": "struct",
            "name": "Block"
          },
          {
            "fields": [
              {
                "name": "anchor_timestamp_ms",
                "type": "u64"
              },
              {
                "name": "length_ms",
                "type": "u64"
              }
            ],
            "kind": "struct",
            "name": "Timestamp"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "basis",
            "type": "CycleBasis"
          },
          {
            "name": "stake_activation_delay",
            "type": "u64"
          },
          {
            "name": "unstake_activation_delay",
            "type": "u64"
          },
          {
            "name": "commission_change_delay",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "PoolCycleConfig",
        "typeTag": "2586632331894924797"
      },
      {
        "fields": [
          {
            "name": "manage_status",
            "type": "bool"
          },
          {
            "name": "manage_rewards",
            "type": "bool"
          }
        ],
        "kind": "struct",
        "name": "PoolAppPermissions",
        "typeTag": "6213321200983040698"
      },
      {
        "fields": [
          {
            "name": "pool_id",
            "type": "B256"
          },
          {
            "name": "owner",
            "type": "Address"
          },
          {
            "name": "manager_app",
            "type": "option<u8>"
          },
          {
            "name": "app_permissions",
            "type": "PoolAppPermissions"
          },
          {
            "name": "stake_asset",
            "type": "Address"
          },
          {
            "name": "reward_asset",
            "type": "Address"
          },
          {
            "name": "cycle_config",
            "type": "PoolCycleConfig"
          }
        ],
        "kind": "struct",
        "name": "PoolDefinition",
        "typeTag": "13417802696927158930"
      },
      {
        "fields": [
          {
            "name": "status",
            "type": "PoolStatus"
          },
          {
            "name": "closing_cycle",
            "type": "option<u64>"
          }
        ],
        "kind": "struct",
        "name": "PoolControl",
        "typeTag": "10399656449715050992"
      },
      {
        "fields": [
          {
            "name": "pool_id",
            "type": "B256"
          },
          {
            "name": "owner",
            "type": "Address"
          },
          {
            "name": "manager_app",
            "type": "option<u8>"
          },
          {
            "name": "app_permissions",
            "type": "PoolAppPermissions"
          },
          {
            "name": "stake_asset",
            "type": "Address"
          },
          {
            "name": "reward_asset",
            "type": "Address"
          },
          {
            "name": "cycle_config",
            "type": "PoolCycleConfig"
          },
          {
            "name": "status",
            "type": "PoolStatus"
          },
          {
            "name": "active_principal",
            "type": "u64"
          },
          {
            "name": "reward_index",
            "type": "u128"
          },
          {
            "name": "reward_config",
            "type": "PoolRewardConfig"
          },
          {
            "name": "held_principal",
            "type": "u64"
          },
          {
            "name": "pending_principal",
            "type": "u64"
          },
          {
            "name": "reward_liability",
            "type": "u64"
          },
          {
            "name": "commission_liability",
            "type": "u64"
          },
          {
            "name": "position_count",
            "type": "u64"
          },
          {
            "name": "settlement_cursor",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "Pool",
        "typeTag": "15051713596546630303"
      },
      {
        "fields": [
          {
            "name": "cycle",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "PendingAmount",
        "typeTag": "11270933695585623483"
      },
      {
        "fields": [
          {
            "name": "owner",
            "type": "Address"
          },
          {
            "name": "pool_id",
            "type": "B256"
          },
          {
            "name": "active_principal",
            "type": "u64"
          },
          {
            "name": "rewards",
            "type": "map<Address,AssetReward>"
          },
          {
            "name": "claimable_principal",
            "type": "u64"
          },
          {
            "name": "deposits",
            "type": "vec<PendingAmount>"
          },
          {
            "name": "exits",
            "type": "vec<PendingAmount>"
          },
          {
            "name": "tracked",
            "type": "bool"
          }
        ],
        "kind": "struct",
        "name": "Position",
        "typeTag": "877714062706965335"
      },
      {
        "fields": [
          {
            "name": "index",
            "type": "u128"
          },
          {
            "name": "remainder",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "AssetIndex",
        "typeTag": "16830073715515562320"
      },
      {
        "fields": [
          {
            "name": "checkpoint",
            "type": "u128"
          },
          {
            "name": "fraction",
            "type": "u64"
          },
          {
            "name": "claimable",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "AssetReward",
        "typeTag": "18167640969593185507"
      },
      {
        "fields": [
          {
            "name": "commission_rate_bps",
            "type": "u64"
          },
          {
            "name": "commission_recipient",
            "type": "Address"
          }
        ],
        "kind": "struct",
        "name": "PoolRewardConfig",
        "typeTag": "12365982797053730650"
      },
      {
        "fields": [
          {
            "name": "config",
            "type": "PoolRewardConfig"
          },
          {
            "name": "pending",
            "type": "option<PoolRewardConfig>"
          },
          {
            "name": "effective_cycle",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "RewardTerms",
        "typeTag": "2910991785752384865"
      },
      {
        "fields": [
          {
            "name": "cursor",
            "type": "u64"
          },
          {
            "name": "active_principal",
            "type": "u64"
          },
          {
            "name": "rewards",
            "type": "map<Address,AssetIndex>"
          }
        ],
        "kind": "struct",
        "name": "PoolIndex",
        "typeTag": "330247502269344070"
      },
      {
        "fields": [
          {
            "name": "written",
            "type": "bool"
          },
          {
            "name": "rewards",
            "type": "map<Address,AssetIndex>"
          }
        ],
        "kind": "struct",
        "name": "Checkpoint",
        "typeTag": "1244994445814999482"
      },
      {
        "kind": "builtin",
        "name": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "kind": "builtin",
        "name": "B256",
        "typeTag": "12016729314829497160"
      },
      {
        "kind": "builtin",
        "name": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "kind": "builtin",
        "name": "u128",
        "typeTag": "10698497612269247729"
      },
      {
        "kind": "builtin",
        "name": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "kind": "builtin",
        "name": "u8",
        "typeTag": "631772817358541784"
      }
    ],
    "resources": [
      {
        "name": "_Definition",
        "type": "PoolDefinition",
        "typeTag": "13417802696927158930"
      },
      {
        "name": "_Control",
        "type": "PoolControl",
        "typeTag": "10399656449715050992"
      },
      {
        "name": "_Held",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Pending",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Position",
        "type": "Position",
        "typeTag": "877714062706965335"
      },
      {
        "name": "_Positions",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Terms",
        "type": "RewardTerms",
        "typeTag": "2910991785752384865"
      },
      {
        "name": "_Rewards",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Commission",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_CommissionTotal",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Index",
        "type": "PoolIndex",
        "typeTag": "330247502269344070"
      },
      {
        "name": "_Deposits",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Exits",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Checkpoint",
        "type": "Checkpoint",
        "typeTag": "1244994445814999482"
      }
    ],
    "constants": [
      {
        "name": "REWARD_INDEX_SCALE",
        "type": "u128",
        "value": 1000000000000
      },
      {
        "name": "MAX_COMMISSION_RATE_BPS",
        "type": "u64",
        "value": 10000
      },
      {
        "name": "MAX_DELAY",
        "type": "u64",
        "value": 64
      }
    ],
    "events": [
      {
        "fields": [
          {
            "indexed": true,
            "name": "pool_id",
            "type": "B256"
          },
          {
            "indexed": true,
            "name": "owner",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "effective_cycle",
            "type": "u64"
          }
        ],
        "name": "StakeDeposited",
        "typeTag": "9725700363876492253"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "pool_id",
            "type": "B256"
          },
          {
            "indexed": true,
            "name": "owner",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "effective_cycle",
            "type": "u64"
          }
        ],
        "name": "UnstakeRequested",
        "typeTag": "13504388361024046117"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "pool_id",
            "type": "B256"
          },
          {
            "indexed": true,
            "name": "owner",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          }
        ],
        "name": "PrincipalClaimed",
        "typeTag": "15535743807254057191"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "pool_id",
            "type": "B256"
          },
          {
            "indexed": true,
            "name": "owner",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "asset",
            "type": "Address"
          }
        ],
        "name": "RewardsClaimed",
        "typeTag": "18148718922460551977"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "pool_id",
            "type": "B256"
          },
          {
            "indexed": false,
            "name": "old_config",
            "type": "PoolRewardConfig"
          },
          {
            "indexed": false,
            "name": "pending_config",
            "type": "PoolRewardConfig"
          },
          {
            "indexed": false,
            "name": "effective_cycle",
            "type": "u64"
          }
        ],
        "name": "PoolRewardConfigChangeRequested",
        "typeTag": "5948611434188661073"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "pool_id",
            "type": "B256"
          },
          {
            "indexed": false,
            "name": "recipient",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          }
        ],
        "name": "PoolCommissionDistributed",
        "typeTag": "12472100352688581512"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "pool_id",
            "type": "B256"
          },
          {
            "indexed": false,
            "name": "old_config",
            "type": "PoolRewardConfig"
          },
          {
            "indexed": false,
            "name": "new_config",
            "type": "PoolRewardConfig"
          },
          {
            "indexed": false,
            "name": "effective_cycle",
            "type": "u64"
          }
        ],
        "name": "PoolRewardConfigChanged",
        "typeTag": "5005543581933784081"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "pool_id",
            "type": "B256"
          }
        ],
        "name": "PoolDrained",
        "typeTag": "18352118988445275085"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "pool_id",
            "type": "B256"
          },
          {
            "indexed": false,
            "name": "recipient",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "reward_amount",
            "type": "u64"
          }
        ],
        "name": "PoolResidualSwept",
        "typeTag": "249705490704053362"
      }
    ],
    "errors": [
      {
        "code": 768,
        "message": "Invalid parameters: {0}",
        "name": "InvalidParameters"
      },
      {
        "code": 769,
        "message": "Staking invariant violation: {0}",
        "name": "InvariantViolation"
      },
      {
        "code": 770,
        "message": "protocol epoch clock is not initialized",
        "name": "EpochClockNotReady"
      },
      {
        "code": 771,
        "message": "Transparent TokenError",
        "name": "TokenError",
        "transparent": true
      },
      {
        "code": 772,
        "message": "Transparent ContextError",
        "name": "ContextError",
        "transparent": true
      }
    ]
  },
  {
    "metadata": {
      "app_id": 4,
      "name": "identity",
      "description": "Milon identity app IDL"
    },
    "instructions": [
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "issuer",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "issuer_key_id",
            "role": "input",
            "type": "u8"
          },
          {
            "name": "credential_schema",
            "role": "input",
            "type": "String"
          },
          {
            "name": "credential_hash",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "valid_until_ms",
            "role": "input",
            "type": "option<u64>"
          },
          {
            "name": "issuer_signature",
            "role": "input",
            "type": "Signature"
          }
        ],
        "discriminator": 23078,
        "handler": "disclose_vc_attestation",
        "kind": "entry",
        "name": "DiscloseVcAttestation"
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "issuer",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "credential_schema",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 51077,
        "handler": "remove_vc_disclosure",
        "kind": "entry",
        "name": "RemoveVcDisclosure"
      },
      {
        "args": [
          {
            "name": "issuer",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "credential_schema",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 38692,
        "handler": "revoke_vc_attestation",
        "kind": "entry",
        "name": "RevokeVcAttestation"
      },
      {
        "args": [
          {
            "name": "issuer",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "credential_id",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 52523,
        "handler": "freeze_vc_attestation",
        "kind": "entry",
        "name": "FreezeVcAttestation"
      },
      {
        "args": [
          {
            "name": "issuer",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "credential_id",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 10634,
        "handler": "unfreeze_vc_attestation",
        "kind": "entry",
        "name": "UnfreezeVcAttestation"
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "doc",
            "role": "input",
            "type": "DidDocumentInput"
          }
        ],
        "discriminator": 28587,
        "handler": "create",
        "kind": "entry",
        "name": "Create"
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "doc",
            "role": "input",
            "type": "DidDocumentInput"
          },
          {
            "name": "name",
            "role": "input",
            "type": "DidName"
          }
        ],
        "discriminator": 48723,
        "handler": "create_with_alias",
        "kind": "entry",
        "name": "CreateWithAlias"
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "input",
            "role": "input",
            "type": "DidKeyInput"
          }
        ],
        "discriminator": 24314,
        "handler": "add_key",
        "kind": "entry",
        "name": "AddKey",
        "returns": {
          "type": "u8"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "id",
            "role": "input",
            "type": "u8"
          },
          {
            "name": "input",
            "role": "input",
            "type": "DidKeyInput"
          }
        ],
        "discriminator": 38726,
        "handler": "update_key",
        "kind": "entry",
        "name": "UpdateKey"
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "id",
            "role": "input",
            "type": "u8"
          }
        ],
        "discriminator": 14295,
        "handler": "remove_key",
        "kind": "entry",
        "name": "RemoveKey"
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "input",
            "role": "input",
            "type": "DidServiceInput"
          }
        ],
        "discriminator": 45574,
        "handler": "add_service",
        "kind": "entry",
        "name": "AddService",
        "returns": {
          "type": "u8"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "id",
            "role": "input",
            "type": "u8"
          },
          {
            "name": "input",
            "role": "input",
            "type": "DidServiceInput"
          }
        ],
        "discriminator": 18018,
        "handler": "update_service",
        "kind": "entry",
        "name": "UpdateService"
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "id",
            "role": "input",
            "type": "u8"
          }
        ],
        "discriminator": 38683,
        "handler": "remove_service",
        "kind": "entry",
        "name": "RemoveService"
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "avatar_uri",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 7646,
        "handler": "set_avatar_uri",
        "kind": "entry",
        "name": "SetAvatarUri"
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          }
        ],
        "discriminator": 6825,
        "handler": "deactivate",
        "kind": "entry",
        "name": "Deactivate"
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "name",
            "role": "input",
            "type": "DidName"
          }
        ],
        "discriminator": 44782,
        "handler": "set_alias",
        "kind": "entry",
        "name": "SetAlias"
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "roles",
            "role": "input",
            "type": "vec<EntityRole>"
          },
          {
            "name": "credential_schemas",
            "role": "input",
            "type": "vec<String>"
          }
        ],
        "discriminator": 36868,
        "handler": "register_organization",
        "kind": "entry",
        "name": "RegisterOrganization"
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "roles",
            "role": "input",
            "type": "vec<EntityRole>"
          },
          {
            "name": "credential_schemas",
            "role": "input",
            "type": "vec<String>"
          }
        ],
        "discriminator": 13927,
        "handler": "update_organization_capabilities",
        "kind": "entry",
        "name": "UpdateOrganizationCapabilities"
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          }
        ],
        "discriminator": 48597,
        "handler": "deactivate_organization",
        "kind": "entry",
        "name": "DeactivateOrganization"
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "credential_schema",
            "role": "input",
            "type": "String"
          },
          {
            "name": "issuer",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 18681,
        "handler": "vc_attestation_core",
        "kind": "view",
        "name": "VcAttestationCore",
        "returns": {
          "type": "VcAttestationCore"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "credential_schema",
            "role": "input",
            "type": "String"
          },
          {
            "name": "issuer",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 41850,
        "handler": "vc_attestation_lifecycle",
        "kind": "view",
        "name": "VcAttestationLifecycle",
        "returns": {
          "type": "VcAttestationLifecycle"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "credential_schema",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 57307,
        "handler": "accepted_vc_issuer_index_meta",
        "kind": "view",
        "name": "AcceptedVcIssuerIndexMeta",
        "returns": {
          "type": "String"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "credential_schema",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 6419,
        "handler": "accepted_vc_issuers",
        "kind": "view",
        "name": "AcceptedVcIssuers",
        "returns": {
          "type": "vec<AcceptedVcIssuer>"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 48906,
        "handler": "disclosed_vc_schemas",
        "kind": "view",
        "name": "DisclosedVcSchemas",
        "returns": {
          "type": "vec<String>"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "offset",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "limit",
            "role": "input",
            "type": "u16"
          }
        ],
        "discriminator": 27262,
        "handler": "disclosed_vcs",
        "kind": "view",
        "name": "DisclosedVcs",
        "returns": {
          "type": "vec<DisclosedVcSummary>"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "issuer",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "credential_schema",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 18655,
        "handler": "has_valid_vc_from_issuer",
        "kind": "view",
        "name": "HasValidVcFromIssuer",
        "returns": {
          "type": "bool"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 39696,
        "handler": "core",
        "kind": "view",
        "name": "Core",
        "returns": {
          "type": "DidCoreState"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 21854,
        "handler": "document",
        "kind": "view",
        "name": "Document",
        "returns": {
          "type": "DidDocumentState"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 17805,
        "handler": "key_index",
        "kind": "view",
        "name": "KeyIndex",
        "returns": {
          "type": "DidKeyIndexState"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 7171,
        "handler": "keys",
        "kind": "view",
        "name": "Keys",
        "returns": {
          "type": "vec<DidKey>"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "id",
            "role": "input",
            "type": "u8"
          }
        ],
        "discriminator": 49570,
        "handler": "key",
        "kind": "view",
        "name": "Key",
        "returns": {
          "type": "DidKey"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 25961,
        "handler": "service_index",
        "kind": "view",
        "name": "ServiceIndex",
        "returns": {
          "type": "DidServiceIndexState"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 567,
        "handler": "services",
        "kind": "view",
        "name": "Services",
        "returns": {
          "type": "vec<DidService>"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "id",
            "role": "input",
            "type": "u8"
          }
        ],
        "discriminator": 62270,
        "handler": "service",
        "kind": "view",
        "name": "Service",
        "returns": {
          "type": "DidService"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 8101,
        "handler": "alias",
        "kind": "view",
        "name": "Alias",
        "returns": {
          "type": "DidAliasState"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 2498,
        "handler": "avatar",
        "kind": "view",
        "name": "Avatar",
        "returns": {
          "type": "DidAvatarState"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 46666,
        "handler": "updated_at",
        "kind": "view",
        "name": "UpdatedAt",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 12471,
        "handler": "deactivated",
        "kind": "view",
        "name": "Deactivated",
        "returns": {
          "type": "bool"
        }
      },
      {
        "args": [
          {
            "name": "name",
            "role": "input",
            "type": "DidName"
          }
        ],
        "discriminator": 60506,
        "handler": "name_binding",
        "kind": "view",
        "name": "NameBinding",
        "returns": {
          "type": "DidNameBinding"
        }
      },
      {
        "args": [
          {
            "name": "credential_id",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 42682,
        "handler": "credential_definition",
        "kind": "view",
        "name": "CredentialDefinition",
        "returns": {
          "type": "CredentialDefinition"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 6251,
        "handler": "organization_capabilities",
        "kind": "view",
        "name": "OrganizationCapabilities",
        "returns": {
          "type": "OrganizationCapabilities"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 39483,
        "handler": "organization_status",
        "kind": "view",
        "name": "OrganizationStatus",
        "returns": {
          "type": "OrganizationStatus"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 23820,
        "handler": "organization_updated_at",
        "kind": "view",
        "name": "OrganizationUpdatedAt",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "issuer",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "credential_schema",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 63370,
        "handler": "credential_id",
        "kind": "view",
        "name": "CredentialId",
        "returns": {
          "type": "String"
        }
      }
    ],
    "types": [
      {
        "kind": "enum",
        "name": "VcStatus",
        "typeTag": "9880462679300830655",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Active"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Revoked"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Frozen"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "credential_schema",
            "type": "String"
          },
          {
            "name": "credential_hash",
            "type": "B256"
          },
          {
            "name": "valid_until_ms",
            "type": "option<u64>"
          }
        ],
        "kind": "struct",
        "name": "VcAttestationCore",
        "typeTag": "13284599887158957426"
      },
      {
        "fields": [
          {
            "name": "status",
            "type": "VcStatus"
          },
          {
            "name": "updated_at_ms",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "VcAttestationLifecycle",
        "typeTag": "12816573726947866147"
      },
      {
        "fields": [
          {
            "name": "issuer",
            "type": "Address"
          },
          {
            "name": "credential_hash",
            "type": "B256"
          }
        ],
        "kind": "struct",
        "name": "AcceptedVcIssuer",
        "typeTag": "5463606248591120631"
      },
      {
        "fields": [
          {
            "name": "credential_schema",
            "type": "String"
          },
          {
            "name": "issuer",
            "type": "Address"
          },
          {
            "name": "credential_hash",
            "type": "B256"
          },
          {
            "name": "valid_until_ms",
            "type": "option<u64>"
          },
          {
            "name": "status",
            "type": "VcStatus"
          },
          {
            "name": "is_valid",
            "type": "bool"
          }
        ],
        "kind": "struct",
        "name": "DisclosedVcSummary",
        "typeTag": "12260028373739227139"
      },
      {
        "kind": "enum",
        "name": "DidSubjectType",
        "typeTag": "9478614490553199961",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Personal"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Organization"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "subject_type",
            "type": "DidSubjectType"
          },
          {
            "name": "address",
            "type": "Address"
          }
        ],
        "kind": "struct",
        "name": "DidSubject",
        "typeTag": "416089716071506385"
      },
      {
        "fields": [
          {
            "name": "public_key",
            "type": "PublicKey"
          },
          {
            "name": "label",
            "type": "option<String>"
          }
        ],
        "kind": "struct",
        "name": "DidKeyInput",
        "typeTag": "15014017011896880766"
      },
      {
        "fields": [
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "public_key",
            "type": "PublicKey"
          },
          {
            "name": "label",
            "type": "option<String>"
          }
        ],
        "kind": "struct",
        "name": "DidKey",
        "typeTag": "8586647650877785738"
      },
      {
        "fields": [
          {
            "name": "label",
            "type": "String"
          },
          {
            "name": "service_endpoint",
            "type": "String"
          }
        ],
        "kind": "struct",
        "name": "DidServiceInput",
        "typeTag": "2422875015207670442"
      },
      {
        "fields": [
          {
            "name": "id",
            "type": "u8"
          },
          {
            "name": "label",
            "type": "String"
          },
          {
            "name": "service_endpoint",
            "type": "String"
          }
        ],
        "kind": "struct",
        "name": "DidService",
        "typeTag": "15584128414415683126"
      },
      {
        "fields": [
          {
            "name": "subject",
            "type": "DidSubject"
          },
          {
            "name": "controller",
            "type": "Address"
          },
          {
            "name": "keys",
            "type": "vec<DidKey>"
          },
          {
            "name": "services",
            "type": "vec<DidService>"
          },
          {
            "name": "alias",
            "type": "option<DidName>"
          },
          {
            "name": "avatar_uri",
            "type": "String"
          },
          {
            "name": "updated_at_ms",
            "type": "u64"
          },
          {
            "name": "deactivated",
            "type": "bool"
          }
        ],
        "kind": "struct",
        "name": "DidDocumentState",
        "typeTag": "8048280242232229915"
      },
      {
        "fields": [
          {
            "name": "subject_type",
            "type": "DidSubjectType"
          },
          {
            "name": "keys",
            "type": "vec<DidKeyInput>"
          },
          {
            "name": "services",
            "type": "vec<DidServiceInput>"
          },
          {
            "name": "avatar_uri",
            "type": "String"
          }
        ],
        "kind": "struct",
        "name": "DidDocumentInput",
        "typeTag": "8309071724875749370"
      },
      {
        "fields": [
          {
            "name": "alias",
            "type": "String"
          },
          {
            "name": "suffix",
            "type": "u32"
          }
        ],
        "kind": "struct",
        "name": "DidName",
        "typeTag": "7698729844929259832"
      },
      {
        "fields": [
          {
            "name": "name",
            "type": "DidName"
          },
          {
            "name": "subject",
            "type": "DidSubject"
          }
        ],
        "kind": "struct",
        "name": "DidNameBinding",
        "typeTag": "9074654765198733705"
      },
      {
        "fields": [
          {
            "name": "subject",
            "type": "DidSubject"
          },
          {
            "name": "controller",
            "type": "Address"
          }
        ],
        "kind": "struct",
        "name": "DidCoreState",
        "typeTag": "4816427468430260189"
      },
      {
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "key_ids",
            "type": "bytes"
          }
        ],
        "kind": "struct",
        "name": "DidKeyIndexState",
        "typeTag": "7485109064351211459"
      },
      {
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "service_ids",
            "type": "bytes"
          }
        ],
        "kind": "struct",
        "name": "DidServiceIndexState",
        "typeTag": "10048772681438653071"
      },
      {
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "alias",
            "type": "option<DidName>"
          }
        ],
        "kind": "struct",
        "name": "DidAliasState",
        "typeTag": "17095860255518781422"
      },
      {
        "fields": [
          {
            "name": "initialized",
            "type": "bool"
          },
          {
            "name": "avatar_uri",
            "type": "String"
          }
        ],
        "kind": "struct",
        "name": "DidAvatarState",
        "typeTag": "8035018328542407503"
      },
      {
        "kind": "enum",
        "name": "EntityRole",
        "typeTag": "2513156503778733663",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "VcIssuer"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "KycProvider"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "OrganizationStatus",
        "typeTag": "597923890167821929",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Active"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Deactivated"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "roles",
            "type": "vec<EntityRole>"
          },
          {
            "name": "credential_schemas",
            "type": "vec<String>"
          }
        ],
        "kind": "struct",
        "name": "OrganizationCapabilities",
        "typeTag": "4475269952521160741"
      },
      {
        "fields": [
          {
            "name": "issuer",
            "type": "Address"
          },
          {
            "name": "credential_schema",
            "type": "String"
          }
        ],
        "kind": "struct",
        "name": "CredentialDefinition",
        "typeTag": "16303250594096098228"
      },
      {
        "kind": "builtin",
        "name": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "kind": "builtin",
        "name": "B256",
        "typeTag": "12016729314829497160"
      },
      {
        "kind": "builtin",
        "name": "PublicKey",
        "typeTag": "12784977254987571496"
      },
      {
        "kind": "builtin",
        "name": "Signature",
        "typeTag": "9480777115032900864"
      },
      {
        "kind": "builtin",
        "name": "String",
        "typeTag": "8566531010829758022"
      },
      {
        "kind": "builtin",
        "name": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "kind": "builtin",
        "name": "bytes",
        "typeTag": "10405529814227927951"
      },
      {
        "kind": "builtin",
        "name": "u16",
        "typeTag": "5558799945458185151"
      },
      {
        "kind": "builtin",
        "name": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "kind": "builtin",
        "name": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "kind": "builtin",
        "name": "u8",
        "typeTag": "631772817358541784"
      }
    ],
    "resources": [
      {
        "name": "_VcAttestationCore",
        "type": "VcAttestationCore",
        "typeTag": "13284599887158957426"
      },
      {
        "name": "_VcAttestationLifecycle",
        "type": "VcAttestationLifecycle",
        "typeTag": "12816573726947866147"
      },
      {
        "name": "_AcceptedVcIssuerIndexMeta",
        "type": "String",
        "typeTag": "8566531010829758022"
      },
      {
        "name": "_AcceptedVcIssuers",
        "type": "vec<AcceptedVcIssuer>",
        "typeTag": "13749091394093327390"
      },
      {
        "name": "_DisclosedVcSchemas",
        "type": "vec<String>",
        "typeTag": "2316261776970198819"
      },
      {
        "name": "_DidCore",
        "type": "DidCoreState",
        "typeTag": "4816427468430260189"
      },
      {
        "name": "_DidKeyIndex",
        "type": "DidKeyIndexState",
        "typeTag": "7485109064351211459"
      },
      {
        "name": "_DidKey",
        "type": "DidKey",
        "typeTag": "8586647650877785738"
      },
      {
        "name": "_DidServiceIndex",
        "type": "DidServiceIndexState",
        "typeTag": "10048772681438653071"
      },
      {
        "name": "_DidService",
        "type": "DidService",
        "typeTag": "15584128414415683126"
      },
      {
        "name": "_DidAlias",
        "type": "DidAliasState",
        "typeTag": "17095860255518781422"
      },
      {
        "name": "_DidAvatar",
        "type": "DidAvatarState",
        "typeTag": "8035018328542407503"
      },
      {
        "name": "_DidUpdatedAt",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_DidDeactivate",
        "type": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "name": "_NameBinding",
        "type": "DidNameBinding",
        "typeTag": "9074654765198733705"
      },
      {
        "name": "_OrganizationCapabilities",
        "type": "OrganizationCapabilities",
        "typeTag": "4475269952521160741"
      },
      {
        "name": "_CredentialDefinition",
        "type": "CredentialDefinition",
        "typeTag": "16303250594096098228"
      },
      {
        "name": "_OrganizationStatus",
        "type": "OrganizationStatus",
        "typeTag": "597923890167821929"
      },
      {
        "name": "_OrganizationUpdatedAt",
        "type": "u64",
        "typeTag": "5563585020063213298"
      }
    ],
    "constants": [
      {
        "name": "MAX_DISCLOSED_VCS_PER_SUBJECT",
        "type": "usize",
        "value": 64
      },
      {
        "name": "MAX_CREDENTIAL_SCHEMAS",
        "type": "usize",
        "value": 32
      }
    ],
    "errors": [
      {
        "code": 1024,
        "message": "DID already exists for subject: {0:?}",
        "name": "DidAlreadyExists"
      },
      {
        "code": 1025,
        "message": "DID not found for subject: {0:?}",
        "name": "DidNotFound"
      },
      {
        "code": 1026,
        "message": "DID is deactivated: {0:?}",
        "name": "DidDeactivated"
      },
      {
        "code": 1027,
        "message": "Invalid DID: {0}",
        "name": "InvalidDid"
      },
      {
        "code": 1028,
        "message": "DID name already bound: {0}",
        "name": "NameAlreadyBound"
      },
      {
        "code": 1029,
        "message": "DID name binding not found: {0}",
        "name": "NameNotFound"
      },
      {
        "code": 1030,
        "message": "Organization profile not found: {0:?}",
        "name": "OrganizationNotFound"
      },
      {
        "code": 1031,
        "message": "Organization already registered: {0:?}",
        "name": "OrganizationAlreadyExists"
      },
      {
        "code": 1032,
        "message": "VC attestation not found: subject={0:?}, issuer={1:?}",
        "name": "VcAttestationNotFound"
      },
      {
        "code": 1033,
        "message": "VC issuer DID does not exist or is deactivated: {0:?}",
        "name": "IssuerDidNotActive"
      },
      {
        "code": 1034,
        "message": "DID name length is invalid",
        "name": "NameInvalidLength"
      },
      {
        "code": 1035,
        "message": "DID name must use alias-digits format",
        "name": "NameInvalidFormat"
      },
      {
        "code": 1036,
        "message": "DID name alias length is invalid",
        "name": "NameAliasInvalidLength"
      },
      {
        "code": 1037,
        "message": "DID name suffix must contain the required number of digits",
        "name": "NameSuffixInvalid"
      },
      {
        "code": 1038,
        "message": "DID name hash collision",
        "name": "NameHashCollision"
      },
      {
        "code": 1039,
        "message": "DID document key count is invalid",
        "name": "InvalidKeyCount"
      },
      {
        "code": 1040,
        "message": "DID key was not found",
        "name": "DidKeyNotFound"
      },
      {
        "code": 1041,
        "message": "The last DID key cannot be removed",
        "name": "CannotRemoveLastKey"
      },
      {
        "code": 1042,
        "message": "DID key resource does not match its numeric ID",
        "name": "DidKeyResourceMismatch"
      },
      {
        "code": 1043,
        "message": "DID key label is empty or exceeds the length limit",
        "name": "InvalidKeyLabel"
      },
      {
        "code": 1044,
        "message": "DID avatar URI length must be between 1 and 512 bytes",
        "name": "InvalidAvatarUri"
      },
      {
        "code": 1045,
        "message": "DID service count exceeds the limit",
        "name": "TooManyServices"
      },
      {
        "code": 1046,
        "message": "DID service label is invalid",
        "name": "InvalidServiceLabel"
      },
      {
        "code": 1047,
        "message": "DID service endpoint length is invalid",
        "name": "ServiceEndpointInvalidLength"
      },
      {
        "code": 1048,
        "message": "DID service endpoint is not an absolute URI",
        "name": "ServiceEndpointNotAbsolute"
      },
      {
        "code": 1049,
        "message": "DID service endpoint scheme is invalid",
        "name": "ServiceEndpointInvalidScheme"
      },
      {
        "code": 1050,
        "message": "DID service was not found",
        "name": "ServiceNotFound"
      },
      {
        "code": 1051,
        "message": "DID service resource does not match its numeric ID",
        "name": "DidServiceResourceMismatch"
      },
      {
        "code": 1052,
        "message": "Organization registration requires an organization DID: {0:?}",
        "name": "OrganizationDidRequired"
      },
      {
        "code": 1053,
        "message": "Organization is permanently deactivated: {0:?}",
        "name": "OrganizationDeactivated"
      },
      {
        "code": 1054,
        "message": "Organization role count is invalid",
        "name": "InvalidOrganizationRoleCount"
      },
      {
        "code": 1055,
        "message": "Organization roles must be unique",
        "name": "DuplicateOrganizationRole"
      },
      {
        "code": 1056,
        "message": "Organization credential schema count exceeds the limit",
        "name": "TooManyCredentialSchemas"
      },
      {
        "code": 1057,
        "message": "Credential schema is invalid",
        "name": "InvalidCredentialSchema"
      },
      {
        "code": 1058,
        "message": "Organization credential schemas must be unique",
        "name": "DuplicateCredentialSchema"
      },
      {
        "code": 1059,
        "message": "VC issuer or KYC provider must declare a credential schema",
        "name": "IssuerCredentialSchemaRequired"
      },
      {
        "code": 1060,
        "message": "Credential ID hash collision",
        "name": "CredentialIdCollision"
      },
      {
        "code": 1061,
        "message": "Credential ID is invalid",
        "name": "InvalidCredentialId"
      },
      {
        "code": 1062,
        "message": "Credential definition not found: {0}",
        "name": "CredentialDefinitionNotFound"
      },
      {
        "code": 1063,
        "message": "Credential schema index does not match the requested schema",
        "name": "CredentialSchemaMismatch"
      },
      {
        "code": 1064,
        "message": "Accepted VC issuer count exceeds the limit",
        "name": "TooManyAcceptedVcIssuers"
      },
      {
        "code": 1065,
        "message": "Disclosed VC schema count exceeds the limit",
        "name": "TooManyDisclosedVcSchemas"
      },
      {
        "code": 1066,
        "message": "Only a currently valid VC attestation can be accepted",
        "name": "VcAttestationNotCurrentlyValid"
      },
      {
        "code": 1067,
        "message": "VC acceptance index does not exist for subject",
        "name": "VcAcceptanceIndexNotFound"
      },
      {
        "code": 1068,
        "message": "VC issuer is not in the subject acceptance index",
        "name": "VcIssuerNotAccepted"
      },
      {
        "code": 1069,
        "message": "VC attestation issuer signature is invalid",
        "name": "InvalidVcIssuerSignature"
      },
      {
        "code": 1070,
        "message": "VC issuer DID key was not found: issuer={0:?}, key_id={1}",
        "name": "VcIssuerKeyNotFound"
      },
      {
        "code": 1071,
        "message": "VC attestation already exists with different immutable content",
        "name": "VcAttestationAlreadyExists"
      },
      {
        "code": 1072,
        "message": "VC attestation has been permanently revoked",
        "name": "VcAttestationRevoked"
      },
      {
        "code": 1073,
        "message": "VC attestation is already frozen",
        "name": "VcAttestationAlreadyFrozen"
      },
      {
        "code": 1074,
        "message": "VC attestation is not frozen",
        "name": "VcAttestationNotFrozen"
      },
      {
        "code": 1075,
        "message": "Disclosed VC count exceeds the limit",
        "name": "TooManyDisclosedVcs"
      }
    ]
  },
  {
    "metadata": {
      "app_id": 5,
      "name": "sftoken",
      "description": "Milon sftoken app IDL"
    },
    "instructions": [
      {
        "args": [
          {
            "name": "sft",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "metadata",
            "role": "input",
            "type": "Metadata"
          },
          {
            "name": "royalty_bps",
            "role": "input",
            "type": "u16"
          }
        ],
        "discriminator": 5334,
        "handler": "create_sft",
        "kind": "entry",
        "name": "CreateSft"
      },
      {
        "args": [
          {
            "name": "creator",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "slot",
            "role": "input",
            "type": "SlotData"
          },
          {
            "name": "is_transferable",
            "role": "input",
            "type": "bool"
          }
        ],
        "discriminator": 56115,
        "handler": "create_slot",
        "kind": "entry",
        "name": "CreateSlot",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "current_owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "new_owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 35617,
        "handler": "transfer_owner",
        "kind": "entry",
        "name": "TransferOwner"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "cover_url",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 480,
        "handler": "set_cover_url",
        "kind": "entry",
        "name": "SetCoverUrl"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "uri",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 4819,
        "handler": "set_uri",
        "kind": "entry",
        "name": "SetUri"
      },
      {
        "args": [
          {
            "name": "current",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "new",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 33676,
        "handler": "transfer_mint_authority",
        "kind": "entry",
        "name": "TransferMintAuthority"
      },
      {
        "args": [
          {
            "name": "current",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "new",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 57787,
        "handler": "transfer_update_author",
        "kind": "entry",
        "name": "TransferUpdateAuthor"
      },
      {
        "args": [
          {
            "name": "current",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "new",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 26719,
        "handler": "transfer_freeze_authority",
        "kind": "entry",
        "name": "TransferFreezeAuthority"
      },
      {
        "args": [
          {
            "name": "current",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "new_recipient",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 56414,
        "handler": "transfer_royalty_recipient",
        "kind": "entry",
        "name": "TransferRoyaltyRecipient"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "slot_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "transferable",
            "role": "input",
            "type": "bool"
          }
        ],
        "discriminator": 57575,
        "handler": "set_slot_transferable",
        "kind": "entry",
        "name": "SetSlotTransferable"
      },
      {
        "args": [
          {
            "name": "author",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "slot_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "attribute",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 3272,
        "handler": "set_slot_attribute",
        "kind": "entry",
        "name": "SetSlotAttribute"
      },
      {
        "args": [
          {
            "name": "author",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "slot_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "cover_url",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 15677,
        "handler": "set_slot_cover_url",
        "kind": "entry",
        "name": "SetSlotCoverUrl"
      },
      {
        "args": [
          {
            "name": "author",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "slot_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "uri",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 28914,
        "handler": "set_slot_uri",
        "kind": "entry",
        "name": "SetSlotUri"
      },
      {
        "args": [
          {
            "name": "minter",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "slot_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "to",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "metadata",
            "role": "input",
            "type": "option<MetadataOverride>"
          }
        ],
        "discriminator": 43610,
        "handler": "mint",
        "kind": "entry",
        "name": "Mint",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 7015,
        "handler": "burn",
        "kind": "entry",
        "name": "Burn"
      },
      {
        "args": [
          {
            "name": "freezer",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 36565,
        "handler": "freeze",
        "kind": "entry",
        "name": "Freeze"
      },
      {
        "args": [
          {
            "name": "freezer",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 49498,
        "handler": "unfreeze",
        "kind": "entry",
        "name": "Unfreeze"
      },
      {
        "args": [
          {
            "name": "author",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "attribute",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 50607,
        "handler": "set_token_attribute",
        "kind": "entry",
        "name": "SetTokenAttribute"
      },
      {
        "args": [
          {
            "name": "author",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "cover_url",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 58854,
        "handler": "set_token_cover_url",
        "kind": "entry",
        "name": "SetTokenCoverUrl"
      },
      {
        "args": [
          {
            "name": "author",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "uri",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 50621,
        "handler": "set_token_uri",
        "kind": "entry",
        "name": "SetTokenUri"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "spender",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 34407,
        "handler": "approve",
        "kind": "entry",
        "name": "Approve"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "spender",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 57842,
        "handler": "revoke_approval",
        "kind": "entry",
        "name": "RevokeApproval"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "from_token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "to",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 50774,
        "handler": "split",
        "kind": "entry",
        "name": "Split",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "from_token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "to_token_id",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 110,
        "handler": "merge",
        "kind": "entry",
        "name": "Merge"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "to",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 48437,
        "handler": "transfer",
        "kind": "entry",
        "name": "Transfer"
      },
      {
        "args": [
          {
            "name": "spender",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "from",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "to",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 19098,
        "handler": "transfer_from",
        "kind": "entry",
        "name": "TransferFrom"
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 34242,
        "handler": "backfill_total_balance",
        "kind": "entry",
        "name": "BackfillTotalBalance"
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 63205,
        "handler": "backfill_total_supply",
        "kind": "entry",
        "name": "BackfillTotalSupply"
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 46443,
        "handler": "sft_owner_of",
        "kind": "view",
        "name": "SftOwnerOf",
        "returns": {
          "type": "Address"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 12747,
        "handler": "sft_metadata",
        "kind": "view",
        "name": "SftMetadata",
        "returns": {
          "type": "Metadata"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "slot_id",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 48907,
        "handler": "slot_info",
        "kind": "view",
        "name": "SlotInfo",
        "returns": {
          "type": "SlotData"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "slot_id",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 26530,
        "handler": "slot_metadata",
        "kind": "view",
        "name": "SlotMetadata",
        "returns": {
          "type": "Metadata"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "slot_id",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 16363,
        "handler": "is_slot_transferable",
        "kind": "view",
        "name": "IsSlotTransferable",
        "returns": {
          "type": "bool"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 35083,
        "handler": "token",
        "kind": "view",
        "name": "Token",
        "returns": {
          "type": "Metadata"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 38850,
        "handler": "slot_of",
        "kind": "view",
        "name": "SlotOf",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 63018,
        "handler": "balance_of",
        "kind": "view",
        "name": "BalanceOf",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 59068,
        "handler": "frozen_of",
        "kind": "view",
        "name": "FrozenOf",
        "returns": {
          "type": "bool"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "spender",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 63999,
        "handler": "approval_of",
        "kind": "view",
        "name": "ApprovalOf",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 30311,
        "handler": "royalty_info",
        "kind": "view",
        "name": "RoyaltyInfo",
        "returns": {
          "type": "Royalty"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 57868,
        "handler": "mint_authority",
        "kind": "view",
        "name": "MintAuthority",
        "returns": {
          "type": "Address"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 6459,
        "handler": "update_author",
        "kind": "view",
        "name": "UpdateAuthor",
        "returns": {
          "type": "Address"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 10975,
        "handler": "freeze_authority",
        "kind": "view",
        "name": "FreezeAuthority",
        "returns": {
          "type": "Address"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 32597,
        "handler": "total_balance_of",
        "kind": "view",
        "name": "TotalBalanceOf",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 56878,
        "handler": "total_balance_status",
        "kind": "view",
        "name": "TotalBalanceStatus",
        "returns": {
          "type": "SftBalanceState"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 35462,
        "handler": "total_supply",
        "kind": "view",
        "name": "TotalSupply",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "sft",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 30765,
        "handler": "total_supply_status",
        "kind": "view",
        "name": "TotalSupplyStatus",
        "returns": {
          "type": "SftBalanceState"
        }
      }
    ],
    "types": [
      {
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "next_token_id",
            "type": "u64"
          },
          {
            "name": "ready",
            "type": "bool"
          }
        ],
        "kind": "struct",
        "name": "SftBalanceState",
        "typeTag": "5332615791021347137"
      },
      {
        "fields": [
          {
            "name": "name",
            "type": "String"
          },
          {
            "name": "symbol",
            "type": "String"
          },
          {
            "name": "cover_url",
            "type": "String"
          },
          {
            "name": "metadata",
            "type": "String"
          },
          {
            "name": "attribute",
            "type": "option<String>"
          }
        ],
        "kind": "struct",
        "name": "Metadata",
        "typeTag": "14606240850061279456"
      },
      {
        "fields": [
          {
            "name": "name",
            "type": "option<String>"
          },
          {
            "name": "symbol",
            "type": "option<String>"
          },
          {
            "name": "cover_url",
            "type": "option<String>"
          },
          {
            "name": "metadata",
            "type": "option<String>"
          },
          {
            "name": "attribute",
            "type": "option<String>"
          }
        ],
        "kind": "struct",
        "name": "MetadataOverride",
        "typeTag": "18305222463683997936"
      },
      {
        "fields": [
          {
            "name": "metadata",
            "type": "option<MetadataOverride>"
          }
        ],
        "kind": "struct",
        "name": "Token",
        "typeTag": "15244655057074605074"
      },
      {
        "fields": [
          {
            "name": "metadata",
            "type": "option<MetadataOverride>"
          }
        ],
        "kind": "struct",
        "name": "SlotData",
        "typeTag": "16053204672031418177"
      },
      {
        "fields": [
          {
            "name": "recipient",
            "type": "Address"
          },
          {
            "name": "bps",
            "type": "u16"
          }
        ],
        "kind": "struct",
        "name": "Royalty",
        "typeTag": "15605079096527761999"
      },
      {
        "kind": "builtin",
        "name": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "kind": "builtin",
        "name": "String",
        "typeTag": "8566531010829758022"
      },
      {
        "kind": "builtin",
        "name": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "kind": "builtin",
        "name": "u16",
        "typeTag": "5558799945458185151"
      },
      {
        "kind": "builtin",
        "name": "u64",
        "typeTag": "5563585020063213298"
      }
    ],
    "resources": [
      {
        "name": "_SftBalanceTracking",
        "type": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "name": "_SftBalance",
        "type": "SftBalanceState",
        "typeTag": "5332615791021347137"
      },
      {
        "name": "_SftTotalSupply",
        "type": "SftBalanceState",
        "typeTag": "5332615791021347137"
      },
      {
        "name": "_SftOwner",
        "type": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "name": "_SftMetadata",
        "type": "Metadata",
        "typeTag": "14606240850061279456"
      },
      {
        "name": "_SftRoyalty",
        "type": "Royalty",
        "typeTag": "15605079096527761999"
      },
      {
        "name": "_SftNextSlotId",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_SftNextTokenId",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_SftMintPermission",
        "type": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "name": "_SftUpdatePermission",
        "type": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "name": "_SftFreezePermission",
        "type": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "name": "_Slot",
        "type": "SlotData",
        "typeTag": "16053204672031418177"
      },
      {
        "name": "_SlotExists",
        "type": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "name": "_SlotTransferable",
        "type": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "name": "_Token",
        "type": "Token",
        "typeTag": "15244655057074605074"
      },
      {
        "name": "_TokenSlotId",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_TokenSupply",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_TokenBalance",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_TokenFrozen",
        "type": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "name": "_Approval",
        "type": "u64",
        "typeTag": "5563585020063213298"
      }
    ],
    "constants": [
      {
        "name": "SFT_BALANCE_BACKFILL_BATCH",
        "type": "u64",
        "value": 64
      }
    ],
    "events": [
      {
        "fields": [
          {
            "indexed": true,
            "name": "sft",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "owner",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "metadata",
            "type": "Metadata"
          }
        ],
        "name": "SftCreatedEvent",
        "typeTag": "2981143492345285184"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "sft",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "slot_id",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "metadata",
            "type": "SlotData"
          }
        ],
        "name": "SlotCreatedEvent",
        "typeTag": "4235690943934686077"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "sft",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "token_id",
            "type": "u64"
          },
          {
            "indexed": true,
            "name": "slot_id",
            "type": "u64"
          },
          {
            "indexed": true,
            "name": "owner",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          }
        ],
        "name": "TokenMintedEvent",
        "typeTag": "1828566942864293301"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "sft",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "token_id",
            "type": "u64"
          },
          {
            "indexed": true,
            "name": "slot_id",
            "type": "u64"
          },
          {
            "indexed": true,
            "name": "owner",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          }
        ],
        "name": "TokenBurnedEvent",
        "typeTag": "10040848747697517430"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "sft",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "from_token_id",
            "type": "u64"
          },
          {
            "indexed": true,
            "name": "to_token_id",
            "type": "u64"
          },
          {
            "indexed": true,
            "name": "from",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "to",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          }
        ],
        "name": "TokenTransferredEvent",
        "typeTag": "9654273125643600240"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "sft",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "token_id",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "attribute",
            "type": "String"
          }
        ],
        "name": "AttributeSetEvent",
        "typeTag": "12159843087237117007"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "sft",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "from",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "to",
            "type": "Address"
          }
        ],
        "name": "RoyaltyRecipientTransferredEvent",
        "typeTag": "6008898740863307008"
      }
    ],
    "errors": [
      {
        "code": 1280,
        "message": "unauthorized signer: {0:?}",
        "name": "Unauthorized"
      },
      {
        "code": 1281,
        "message": "source and destination tokens belong to different slots: {0} != {1}",
        "name": "SlotMismatch"
      },
      {
        "code": 1282,
        "message": "insufficient token amount (token: {0}, available: {1}, required: {2})",
        "name": "InsufficientBalance"
      },
      {
        "code": 1283,
        "message": "token not found: {0}",
        "name": "TokenNotFound"
      },
      {
        "code": 1284,
        "message": "slot not found: {0}",
        "name": "SlotNotFound"
      },
      {
        "code": 1285,
        "message": "SFT has not been created",
        "name": "SftNotFound"
      },
      {
        "code": 1286,
        "message": "amount must be greater than zero",
        "name": "ZeroValueOperation"
      },
      {
        "code": 1287,
        "message": "source and destination must differ",
        "name": "SelfTransfer"
      },
      {
        "code": 1288,
        "message": "split amount must be less than source balance (token: {0}, balance: {1})",
        "name": "FullBalanceSplit"
      },
      {
        "code": 1289,
        "message": "a token cannot be merged into itself",
        "name": "SelfMerge"
      },
      {
        "code": 1290,
        "message": "token balance is frozen (token: {0}, owner: {1:?})",
        "name": "TokenFrozen"
      },
      {
        "code": 1291,
        "message": "SFT already exists",
        "name": "SftAlreadyExists"
      },
      {
        "code": 1292,
        "message": "invalid SFT parameters: {0}",
        "name": "InvalidParameters"
      },
      {
        "code": 1293,
        "message": "token id sequence is exhausted",
        "name": "TokenIdExhausted"
      },
      {
        "code": 1294,
        "message": "slot id sequence is exhausted",
        "name": "SlotIdExhausted"
      },
      {
        "code": 1295,
        "message": "arithmetic overflow",
        "name": "Overflow"
      },
      {
        "code": 1296,
        "message": "insufficient approval (token: {0}, owner: {1:?}, spender: {2:?}, available: {3}, required: {4})",
        "name": "InsufficientApproval"
      },
      {
        "code": 1297,
        "message": "SFT total balance is not initialized: {0:?}",
        "name": "TotalBalanceNotReady"
      },
      {
        "code": 1298,
        "message": "SFT total supply is not initialized",
        "name": "TotalSupplyNotReady"
      }
    ]
  },
  {
    "metadata": {
      "app_id": 6,
      "name": "dex",
      "description": "Milon dex app IDL"
    },
    "instructions": [
      {
        "args": [
          {
            "name": "authority",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "provider",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "base_amount",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "quote_amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 60506,
        "handler": "create_amm_pool",
        "kind": "entry",
        "name": "CreateAmmPool",
        "returns": {
          "type": "AmmPoolInfo"
        }
      },
      {
        "args": [
          {
            "name": "authority",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "provider",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "base_amount",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "quote_amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 37332,
        "handler": "initialize_amm_pool",
        "kind": "entry",
        "name": "InitializeAmmPool",
        "returns": {
          "type": "AmmPoolInfo"
        }
      },
      {
        "args": [
          {
            "name": "authority",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "status",
            "role": "input",
            "type": "AmmStatus"
          }
        ],
        "discriminator": 20736,
        "handler": "set_amm_status",
        "kind": "entry",
        "name": "SetAmmStatus"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "base_max",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "quote_max",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "min_lp_shares",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 50155,
        "handler": "add_liquidity",
        "kind": "entry",
        "name": "AddLiquidity",
        "returns": {
          "type": "AddLiquidityResult"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "lp_shares",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "min_base_out",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "min_quote_out",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 15914,
        "handler": "remove_liquidity",
        "kind": "entry",
        "name": "RemoveLiquidity",
        "returns": {
          "type": "RemoveLiquidityResult"
        }
      },
      {
        "args": [
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 60394,
        "handler": "amm_pool_info",
        "kind": "view",
        "name": "AmmPoolInfo",
        "returns": {
          "type": "AmmPoolInfo"
        }
      },
      {
        "args": [
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 18436,
        "handler": "amm_lp_balance",
        "kind": "view",
        "name": "AmmLpBalance",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "input_token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount_in",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "min_amount_out",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "worst_tick",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "max_book_makers",
            "role": "input",
            "type": "u16"
          },
          {
            "name": "max_amm_segments",
            "role": "input",
            "type": "u16"
          },
          {
            "name": "promoter",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 34800,
        "handler": "swap_exact_in",
        "kind": "entry",
        "name": "SwapExactIn",
        "returns": {
          "type": "HybridSwapResult"
        }
      },
      {
        "args": [
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 52994,
        "handler": "amm_swap_enabled",
        "kind": "view",
        "name": "AmmSwapEnabled",
        "returns": {
          "type": "bool"
        }
      },
      {
        "args": [
          {
            "name": "authority",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "base_token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "quote_token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "base_lot_atoms",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "quote_atoms_per_lot_tick",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "min_tick",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "max_tick",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "max_order_lots",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "max_fills_per_action",
            "role": "input",
            "type": "u16"
          }
        ],
        "discriminator": 122,
        "handler": "create_market",
        "kind": "entry",
        "name": "CreateMarket",
        "returns": {
          "type": "Address"
        }
      },
      {
        "args": [
          {
            "name": "authority",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "doc",
            "role": "input",
            "type": "DidDocumentInput"
          }
        ],
        "discriminator": 27598,
        "handler": "initialize_market_did",
        "kind": "entry",
        "name": "InitializeMarketDid"
      },
      {
        "args": [
          {
            "name": "authority",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "issuer",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "issuer_key_id",
            "role": "input",
            "type": "u8"
          },
          {
            "name": "credential_schema",
            "role": "input",
            "type": "String"
          },
          {
            "name": "credential_hash",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "valid_until_ms",
            "role": "input",
            "type": "option<u64>"
          },
          {
            "name": "issuer_signature",
            "role": "input",
            "type": "Signature"
          }
        ],
        "discriminator": 47697,
        "handler": "disclose_market_vc_attestation",
        "kind": "entry",
        "name": "DiscloseMarketVcAttestation"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "client_order_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "side",
            "role": "input",
            "type": "OrderSide"
          },
          {
            "name": "price_tick",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "base_lots",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "time_in_force",
            "role": "input",
            "type": "OrderTimeInForce"
          },
          {
            "name": "self_trade_policy",
            "role": "input",
            "type": "OrderSelfTradePolicy"
          },
          {
            "name": "max_fills",
            "role": "input",
            "type": "u16"
          },
          {
            "name": "promoter",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 24195,
        "handler": "place_limit_order",
        "kind": "entry",
        "name": "PlaceLimitOrder",
        "returns": {
          "type": "PlaceOrderResult"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "order_id",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 54560,
        "handler": "cancel_order",
        "kind": "entry",
        "name": "CancelOrder",
        "returns": {
          "type": "OrderInfo"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "client_order_id",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 16334,
        "handler": "cancel_by_client_order_id",
        "kind": "entry",
        "name": "CancelByClientOrderId",
        "returns": {
          "type": "OrderInfo"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "order_ids",
            "role": "input",
            "type": "vec<u64>"
          }
        ],
        "discriminator": 55242,
        "handler": "batch_cancel",
        "kind": "entry",
        "name": "BatchCancel",
        "returns": {
          "type": "vec<OrderInfo>"
        }
      },
      {
        "args": [
          {
            "name": "authority",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "status",
            "role": "input",
            "type": "MarketStatus"
          }
        ],
        "discriminator": 48095,
        "handler": "set_market_status",
        "kind": "entry",
        "name": "SetMarketStatus"
      },
      {
        "args": [
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 2326,
        "handler": "market_info",
        "kind": "view",
        "name": "MarketInfo",
        "returns": {
          "type": "Market"
        }
      },
      {
        "args": [
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "order_id",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 23456,
        "handler": "order_info_view",
        "kind": "view",
        "name": "OrderInfoView",
        "returns": {
          "type": "OrderInfo"
        }
      },
      {
        "args": [
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 12137,
        "handler": "best_bid_ask",
        "kind": "view",
        "name": "BestBidAsk",
        "returns": {
          "type": "BestBidAsk"
        }
      },
      {
        "args": [
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "depth",
            "role": "input",
            "type": "u16"
          }
        ],
        "discriminator": 46884,
        "handler": "orderbook_depth",
        "kind": "view",
        "name": "OrderbookDepth",
        "returns": {
          "type": "OrderbookDepth"
        }
      },
      {
        "args": [
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "side",
            "role": "input",
            "type": "OrderSide"
          },
          {
            "name": "tick",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "cursor_order_id",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "limit",
            "role": "input",
            "type": "u16"
          }
        ],
        "discriminator": 24461,
        "handler": "orders_at_level",
        "kind": "view",
        "name": "OrdersAtLevel",
        "returns": {
          "type": "LevelOrderPage"
        }
      },
      {
        "args": [
          {
            "name": "market_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 6759,
        "handler": "vault_liability",
        "kind": "view",
        "name": "VaultLiability",
        "returns": {
          "type": "u64"
        }
      }
    ],
    "types": [
      {
        "kind": "enum",
        "name": "MarketStatus",
        "typeTag": "8136658246324658662",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Active"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "CancelOnly"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Paused"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "AmmStatus",
        "typeTag": "17255121327010776923",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Active"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Stopped"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "OrderSide",
        "typeTag": "4344453968824886479",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Bid"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Ask"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "OrderTimeInForce",
        "typeTag": "2553469515074015685",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "GoodTilCancel"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "ImmediateOrCancel"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "AddLiquidityOnly"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "OrderSelfTradePolicy",
        "typeTag": "17023551718460680910",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "CancelTaker"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "CancelMaker"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "CancelBoth"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "amount_in_used",
            "type": "u64"
          },
          {
            "name": "amount_out",
            "type": "u64"
          },
          {
            "name": "refund",
            "type": "u64"
          },
          {
            "name": "clob_fills",
            "type": "u16"
          },
          {
            "name": "amm_segments",
            "type": "u16"
          }
        ],
        "kind": "struct",
        "name": "HybridSwapResult",
        "typeTag": "6696471684896552292"
      },
      {
        "fields": [
          {
            "name": "base_token",
            "type": "Address"
          },
          {
            "name": "quote_token",
            "type": "Address"
          },
          {
            "name": "vault_seed",
            "type": "u64"
          },
          {
            "name": "base_lot_atoms",
            "type": "u64"
          },
          {
            "name": "quote_atoms_per_lot_tick",
            "type": "u64"
          },
          {
            "name": "min_tick",
            "type": "u32"
          },
          {
            "name": "max_tick",
            "type": "u32"
          },
          {
            "name": "max_order_lots",
            "type": "u64"
          },
          {
            "name": "max_fills_per_action",
            "type": "u16"
          },
          {
            "name": "maker_fee_ppm",
            "type": "u32"
          },
          {
            "name": "taker_fee_ppm",
            "type": "u32"
          },
          {
            "name": "authority",
            "type": "Address"
          },
          {
            "name": "status",
            "type": "MarketStatus"
          }
        ],
        "kind": "struct",
        "name": "Market",
        "typeTag": "11417720480643744764"
      },
      {
        "fields": [
          {
            "name": "market_id",
            "type": "Address"
          },
          {
            "name": "vault",
            "type": "Address"
          },
          {
            "name": "vault_seed",
            "type": "u64"
          },
          {
            "name": "status",
            "type": "AmmStatus"
          },
          {
            "name": "reserve_base",
            "type": "u64"
          },
          {
            "name": "reserve_quote",
            "type": "u64"
          },
          {
            "name": "total_lp_supply",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "AmmPoolInfo",
        "typeTag": "8750917677195605499"
      },
      {
        "fields": [
          {
            "name": "base_amount",
            "type": "u64"
          },
          {
            "name": "quote_amount",
            "type": "u64"
          },
          {
            "name": "lp_shares",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "AddLiquidityResult",
        "typeTag": "12058079632508823720"
      },
      {
        "fields": [
          {
            "name": "base_amount",
            "type": "u64"
          },
          {
            "name": "quote_amount",
            "type": "u64"
          },
          {
            "name": "lp_shares",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "RemoveLiquidityResult",
        "typeTag": "10496775677469623417"
      },
      {
        "fields": [
          {
            "name": "order_id",
            "type": "u64"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "filled_lots",
            "type": "u64"
          },
          {
            "name": "remaining_lots",
            "type": "u64"
          },
          {
            "name": "fill_count",
            "type": "u16"
          },
          {
            "name": "rested",
            "type": "bool"
          }
        ],
        "kind": "struct",
        "name": "PlaceOrderResult",
        "typeTag": "18135230787032878776"
      },
      {
        "fields": [
          {
            "name": "order_id",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "Address"
          },
          {
            "name": "client_order_id",
            "type": "u64"
          },
          {
            "name": "side",
            "type": "u8"
          },
          {
            "name": "limit_tick",
            "type": "u32"
          },
          {
            "name": "original_lots",
            "type": "u64"
          },
          {
            "name": "remaining_lots",
            "type": "u64"
          },
          {
            "name": "reserved_amount",
            "type": "u64"
          },
          {
            "name": "status",
            "type": "u8"
          }
        ],
        "kind": "struct",
        "name": "OrderInfo",
        "typeTag": "15140638547846931512"
      },
      {
        "fields": [
          {
            "name": "tick",
            "type": "u32"
          },
          {
            "name": "order_count",
            "type": "u32"
          },
          {
            "name": "total_base_lots",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "BookLevel",
        "typeTag": "4379979403434364617"
      },
      {
        "fields": [
          {
            "name": "bid",
            "type": "option<BookLevel>"
          },
          {
            "name": "ask",
            "type": "option<BookLevel>"
          }
        ],
        "kind": "struct",
        "name": "BestBidAsk",
        "typeTag": "13185949738965680898"
      },
      {
        "fields": [
          {
            "name": "bids",
            "type": "vec<BookLevel>"
          },
          {
            "name": "asks",
            "type": "vec<BookLevel>"
          }
        ],
        "kind": "struct",
        "name": "OrderbookDepth",
        "typeTag": "16803552831728342894"
      },
      {
        "fields": [
          {
            "name": "orders",
            "type": "vec<OrderInfo>"
          },
          {
            "name": "next_order_id",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "LevelOrderPage",
        "typeTag": "11296366812560025265"
      },
      {
        "fields": [
          {
            "name": "best_tick_plus_one",
            "type": "u64"
          },
          {
            "name": "level_count",
            "type": "u32"
          },
          {
            "name": "order_count",
            "type": "u64"
          },
          {
            "name": "total_base_lots",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "BookRootState",
        "typeTag": "18219184753090619018"
      },
      {
        "fields": [
          {
            "name": "prev_tick_plus_one",
            "type": "u64"
          },
          {
            "name": "next_tick_plus_one",
            "type": "u64"
          },
          {
            "name": "head_order_id",
            "type": "u64"
          },
          {
            "name": "tail_order_id",
            "type": "u64"
          },
          {
            "name": "order_count",
            "type": "u32"
          },
          {
            "name": "total_remaining_lots",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "PriceLevelState",
        "typeTag": "13364006570784410242"
      },
      {
        "fields": [
          {
            "name": "base_token",
            "type": "Address"
          },
          {
            "name": "quote_token",
            "type": "Address"
          },
          {
            "name": "vault_seed",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "MarketTokensState",
        "typeTag": "8338807595321766147"
      },
      {
        "fields": [
          {
            "name": "base_lot_atoms",
            "type": "u64"
          },
          {
            "name": "quote_atoms_per_lot_tick",
            "type": "u64"
          },
          {
            "name": "min_tick",
            "type": "u32"
          },
          {
            "name": "max_tick",
            "type": "u32"
          },
          {
            "name": "max_order_lots",
            "type": "u64"
          },
          {
            "name": "max_fills_per_action",
            "type": "u16"
          },
          {
            "name": "maker_fee_ppm",
            "type": "u32"
          },
          {
            "name": "taker_fee_ppm",
            "type": "u32"
          }
        ],
        "kind": "struct",
        "name": "MarketRulesState",
        "typeTag": "7299804946635011476"
      },
      {
        "fields": [
          {
            "name": "level_count",
            "type": "u32"
          },
          {
            "name": "order_count",
            "type": "u64"
          },
          {
            "name": "total_base_lots",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "BookTotalsState",
        "typeTag": "6922838953909205275"
      },
      {
        "fields": [
          {
            "name": "prev_tick_plus_one",
            "type": "u64"
          },
          {
            "name": "next_tick_plus_one",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "PriceLevelLinkState",
        "typeTag": "1801410411082824438"
      },
      {
        "fields": [
          {
            "name": "head_order_id",
            "type": "u64"
          },
          {
            "name": "tail_order_id",
            "type": "u64"
          },
          {
            "name": "order_count",
            "type": "u32"
          },
          {
            "name": "total_remaining_lots",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "PriceLevelQueueState",
        "typeTag": "13284688305301641569"
      },
      {
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "Address"
          },
          {
            "name": "client_order_id",
            "type": "u64"
          },
          {
            "name": "side",
            "type": "u8"
          },
          {
            "name": "limit_tick",
            "type": "u32"
          },
          {
            "name": "original_lots",
            "type": "u64"
          },
          {
            "name": "time_in_force",
            "type": "u8"
          },
          {
            "name": "self_trade_policy",
            "type": "u8"
          }
        ],
        "kind": "struct",
        "name": "OrderStaticState",
        "typeTag": "15886539911693317967"
      },
      {
        "fields": [
          {
            "name": "remaining_lots",
            "type": "u64"
          },
          {
            "name": "reserved_amount",
            "type": "u64"
          },
          {
            "name": "status",
            "type": "u8"
          }
        ],
        "kind": "struct",
        "name": "OrderMutableState",
        "typeTag": "14240391053584906675"
      },
      {
        "fields": [
          {
            "name": "prev_order_id",
            "type": "u64"
          },
          {
            "name": "next_order_id",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "OrderLinkState",
        "typeTag": "17905626364172625097"
      },
      {
        "fields": [
          {
            "name": "vault_seed",
            "type": "u64"
          },
          {
            "name": "status",
            "type": "u8"
          }
        ],
        "kind": "struct",
        "name": "AmmConfigState",
        "typeTag": "16434333257679736300"
      },
      {
        "fields": [
          {
            "name": "reserve_base",
            "type": "u64"
          },
          {
            "name": "reserve_quote",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "AmmReservesState",
        "typeTag": "37886788338217041"
      },
      {
        "fields": [
          {
            "name": "subject_type",
            "type": "DidSubjectType"
          },
          {
            "name": "keys",
            "type": "vec<DidKeyInput>"
          },
          {
            "name": "services",
            "type": "vec<DidServiceInput>"
          },
          {
            "name": "avatar_uri",
            "type": "String"
          }
        ],
        "kind": "struct",
        "name": "DidDocumentInput",
        "typeTag": "8309071724875749370"
      },
      {
        "fields": [
          {
            "name": "public_key",
            "type": "PublicKey"
          },
          {
            "name": "label",
            "type": "option<String>"
          }
        ],
        "kind": "struct",
        "name": "DidKeyInput",
        "typeTag": "15014017011896880766"
      },
      {
        "fields": [
          {
            "name": "label",
            "type": "String"
          },
          {
            "name": "service_endpoint",
            "type": "String"
          }
        ],
        "kind": "struct",
        "name": "DidServiceInput",
        "typeTag": "2422875015207670442"
      },
      {
        "kind": "enum",
        "name": "DidSubjectType",
        "typeTag": "9478614490553199961",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Personal"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Organization"
          }
        ]
      },
      {
        "kind": "builtin",
        "name": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "kind": "builtin",
        "name": "B256",
        "typeTag": "12016729314829497160"
      },
      {
        "kind": "builtin",
        "name": "PublicKey",
        "typeTag": "12784977254987571496"
      },
      {
        "kind": "builtin",
        "name": "Signature",
        "typeTag": "9480777115032900864"
      },
      {
        "kind": "builtin",
        "name": "String",
        "typeTag": "8566531010829758022"
      },
      {
        "kind": "builtin",
        "name": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "kind": "builtin",
        "name": "u16",
        "typeTag": "5558799945458185151"
      },
      {
        "kind": "builtin",
        "name": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "kind": "builtin",
        "name": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "kind": "builtin",
        "name": "u8",
        "typeTag": "631772817358541784"
      }
    ],
    "resources": [
      {
        "name": "_MarketTokens",
        "type": "MarketTokensState",
        "typeTag": "8338807595321766147"
      },
      {
        "name": "_MarketRules",
        "type": "MarketRulesState",
        "typeTag": "7299804946635011476"
      },
      {
        "name": "_MarketAuthority",
        "type": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "name": "_MarketStatus",
        "type": "u8",
        "typeTag": "631772817358541784"
      },
      {
        "name": "_BookBestTick",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_BookTotals",
        "type": "BookTotalsState",
        "typeTag": "6922838953909205275"
      },
      {
        "name": "_PriceBitmap",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_PriceLevelLinks",
        "type": "PriceLevelLinkState",
        "typeTag": "1801410411082824438"
      },
      {
        "name": "_PriceLevelQueue",
        "type": "PriceLevelQueueState",
        "typeTag": "13284688305301641569"
      },
      {
        "name": "_OrderStatic",
        "type": "OrderStaticState",
        "typeTag": "15886539911693317967"
      },
      {
        "name": "_OrderMutable",
        "type": "OrderMutableState",
        "typeTag": "14240391053584906675"
      },
      {
        "name": "_OrderLinks",
        "type": "OrderLinkState",
        "typeTag": "17905626364172625097"
      },
      {
        "name": "_ClientOrder",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_VaultLiability",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_MarketSequence",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_NextMarketSeed",
        "type": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "name": "_MarketSeedOwner",
        "type": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "name": "_AmmConfig",
        "type": "AmmConfigState",
        "typeTag": "16434333257679736300"
      },
      {
        "name": "_AmmReserves",
        "type": "AmmReservesState",
        "typeTag": "37886788338217041"
      },
      {
        "name": "_AmmLpSupply",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_AmmLpBalance",
        "type": "u64",
        "typeTag": "5563585020063213298"
      }
    ],
    "constants": [
      {
        "name": "MAKER_FEE_PPM",
        "type": "u32",
        "value": 3000
      },
      {
        "name": "TAKER_FEE_PPM",
        "type": "u32",
        "value": 5000
      },
      {
        "name": "FOUNDATION_FEE_BPS",
        "type": "u16",
        "value": 4000
      },
      {
        "name": "STAKING_FEE_BPS",
        "type": "u16",
        "value": 4000
      },
      {
        "name": "PROMOTION_FEE_BPS",
        "type": "u16",
        "value": 2000
      },
      {
        "name": "MAX_BATCH_CANCEL_ORDERS",
        "type": "u16",
        "value": 32
      },
      {
        "name": "MAX_BOOK_DEPTH",
        "type": "u16",
        "value": 50
      },
      {
        "name": "MAX_LEVEL_ORDERS",
        "type": "u16",
        "value": 100
      }
    ],
    "events": [
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "base_token",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "quote_token",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "authority",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "vault_seed",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "maker_fee_ppm",
            "type": "u32"
          },
          {
            "indexed": false,
            "name": "taker_fee_ppm",
            "type": "u32"
          },
          {
            "indexed": false,
            "name": "base_lot_atoms",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "quote_atoms_per_lot_tick",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "min_tick",
            "type": "u32"
          },
          {
            "indexed": false,
            "name": "max_tick",
            "type": "u32"
          }
        ],
        "name": "EventMarketCreated",
        "typeTag": "13227381435063572748"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "authority",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "old_status",
            "type": "u8"
          },
          {
            "indexed": false,
            "name": "new_status",
            "type": "u8"
          }
        ],
        "name": "EventMarketStatusChanged",
        "typeTag": "11184352840010842698"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "authority",
            "type": "Address"
          }
        ],
        "name": "EventMarketDidInitialized",
        "typeTag": "3002442202873949541"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "authority",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "issuer",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "issuer_key_id",
            "type": "u8"
          },
          {
            "indexed": false,
            "name": "credential_schema",
            "type": "String"
          },
          {
            "indexed": false,
            "name": "credential_hash",
            "type": "B256"
          },
          {
            "indexed": false,
            "name": "valid_until_ms",
            "type": "option<u64>"
          }
        ],
        "name": "EventMarketVcAttestationDisclosed",
        "typeTag": "7835306905623771085"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "owner",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "order_id",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "client_order_id",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "side",
            "type": "u8"
          },
          {
            "indexed": false,
            "name": "limit_tick",
            "type": "u32"
          },
          {
            "indexed": false,
            "name": "original_lots",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "remaining_lots",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "filled_lots",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "status",
            "type": "u8"
          },
          {
            "indexed": false,
            "name": "rested",
            "type": "bool"
          }
        ],
        "name": "EventOrderPlaced",
        "typeTag": "608602095549601449"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "owner",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "order_id",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "side",
            "type": "u8"
          },
          {
            "indexed": false,
            "name": "limit_tick",
            "type": "u32"
          },
          {
            "indexed": false,
            "name": "remaining_lots",
            "type": "u64"
          }
        ],
        "name": "EventOrderRested",
        "typeTag": "10581901349291685003"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "maker",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "taker",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "maker_order_id",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "taker_order_id",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "promoter",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "taker_side",
            "type": "u8"
          },
          {
            "indexed": false,
            "name": "price_tick",
            "type": "u32"
          },
          {
            "indexed": false,
            "name": "fill_lots",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "base_atoms",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "quote_atoms",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "fee_atoms",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "fee_sequence",
            "type": "option<u32>"
          }
        ],
        "name": "EventOrderFilled",
        "typeTag": "960997472381498316"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "owner",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "order_id",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "reason",
            "type": "u8"
          },
          {
            "indexed": false,
            "name": "cancelled_lots",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "released_amount",
            "type": "u64"
          }
        ],
        "name": "EventOrderCancelled",
        "typeTag": "6530968372354649335"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "side",
            "type": "u8"
          },
          {
            "indexed": false,
            "name": "tick",
            "type": "u32"
          }
        ],
        "name": "EventPriceLevelOpened",
        "typeTag": "901970323028649804"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "side",
            "type": "u8"
          },
          {
            "indexed": false,
            "name": "tick",
            "type": "u32"
          }
        ],
        "name": "EventPriceLevelClosed",
        "typeTag": "9710101719406525001"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "provider",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "vault",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "vault_seed",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "base_amount",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "quote_amount",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "lp_shares",
            "type": "u64"
          }
        ],
        "name": "EventAmmPoolCreated",
        "typeTag": "7420929212751057073"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "authority",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "old_status",
            "type": "u8"
          },
          {
            "indexed": false,
            "name": "new_status",
            "type": "u8"
          }
        ],
        "name": "EventAmmStatusChanged",
        "typeTag": "17999427990604139897"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "provider",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "base_amount",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "quote_amount",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "lp_shares",
            "type": "u64"
          }
        ],
        "name": "EventLiquidityAdded",
        "typeTag": "14988758762828335514"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "provider",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "base_amount",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "quote_amount",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "lp_shares",
            "type": "u64"
          }
        ],
        "name": "EventLiquidityRemoved",
        "typeTag": "15805841629718478652"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "taker",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "side",
            "type": "u8"
          },
          {
            "indexed": false,
            "name": "input",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "output",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "base_before",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "quote_before",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "base_after",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "quote_after",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "boundary_tick",
            "type": "u32"
          }
        ],
        "name": "EventAmmSwapSegment",
        "typeTag": "11173999819263416163"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "market_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "taker",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "input_token",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "input",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "output",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "refund",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "clob_fills",
            "type": "u16"
          },
          {
            "indexed": false,
            "name": "amm_segments",
            "type": "u16"
          }
        ],
        "name": "EventHybridSwapCompleted",
        "typeTag": "9012270725748501978"
      }
    ],
    "errors": [
      {
        "code": 1536,
        "message": "base token and quote token must differ",
        "name": "SameTokenPair"
      },
      {
        "code": 1537,
        "message": "market parameters must be non-zero",
        "name": "ZeroMarketParameter"
      },
      {
        "code": 1538,
        "message": "market numeric bounds overflow",
        "name": "MarketBoundsOverflow"
      },
      {
        "code": 1539,
        "message": "market seed space exhausted",
        "name": "MarketSeedExhausted"
      },
      {
        "code": 1540,
        "message": "market seed already allocated: {0}",
        "name": "MarketSeedAlreadyAllocated"
      },
      {
        "code": 1541,
        "message": "market already exists: {0:?}",
        "name": "MarketAlreadyExists"
      },
      {
        "code": 1542,
        "message": "market not found: {0:?}",
        "name": "MarketNotFound"
      },
      {
        "code": 1543,
        "message": "market is not active: {0:?}",
        "name": "MarketNotActive"
      },
      {
        "code": 1544,
        "message": "market derived address does not match its seed: {0:?}",
        "name": "MarketAddressMismatch"
      },
      {
        "code": 1545,
        "message": "market state is corrupted: {0:?}",
        "name": "MarketStateCorrupted"
      },
      {
        "code": 1546,
        "message": "market authority mismatch",
        "name": "MarketAuthorityMismatch"
      },
      {
        "code": 1547,
        "message": "order not found: market {0:?}, order {1}",
        "name": "OrderNotFound"
      },
      {
        "code": 1548,
        "message": "client order not found: market {0:?}, owner {1:?}, client order {2}",
        "name": "ClientOrderNotFound"
      },
      {
        "code": 1549,
        "message": "batch cancel order list must not be empty",
        "name": "EmptyBatchCancel"
      },
      {
        "code": 1550,
        "message": "batch cancel size {0} exceeds maximum {1}",
        "name": "BatchCancelLimitExceeded"
      },
      {
        "code": 1551,
        "message": "batch cancel contains duplicate order: {0}",
        "name": "DuplicateBatchOrder"
      },
      {
        "code": 1552,
        "message": "view limit {0} is outside 1..={1}",
        "name": "InvalidViewLimit"
      },
      {
        "code": 1553,
        "message": "requested price level does not exist: market {0:?}, side {1}, tick {2}",
        "name": "PriceLevelNotFound"
      },
      {
        "code": 1554,
        "message": "order cursor does not belong to requested price level: {0}",
        "name": "InvalidOrderCursor"
      },
      {
        "code": 1555,
        "message": "token operation failed with token error code {0}",
        "name": "TokenFailure"
      },
      {
        "code": 1556,
        "message": "orderbook failed with core error code {0}",
        "name": "OrderbookFailure"
      },
      {
        "code": 1557,
        "message": "identity operation failed with identity error code {0}",
        "name": "IdentityFailure"
      },
      {
        "code": 1558,
        "message": "market DID must use the organization subject type",
        "name": "MarketDidMustBeOrganization"
      },
      {
        "code": 1559,
        "message": "AMM pool already exists: {0:?}",
        "name": "AmmPoolAlreadyExists"
      },
      {
        "code": 1560,
        "message": "AMM pool not found: {0:?}",
        "name": "AmmPoolNotFound"
      },
      {
        "code": 1561,
        "message": "AMM pool is not active: {0:?}",
        "name": "AmmPoolNotActive"
      },
      {
        "code": 1562,
        "message": "AMM pool is not stopped: {0:?}",
        "name": "AmmPoolNotStopped"
      },
      {
        "code": 1563,
        "message": "AMM pool state is corrupted: {0:?}",
        "name": "AmmPoolStateCorrupted"
      },
      {
        "code": 1564,
        "message": "AMM liquidity amounts and minimum shares must be non-zero",
        "name": "ZeroLiquidityParameter"
      },
      {
        "code": 1565,
        "message": "AMM liquidity calculation overflow",
        "name": "AmmLiquidityOverflow"
      },
      {
        "code": 1566,
        "message": "AMM liquidity would mint zero shares",
        "name": "ZeroLpShares"
      },
      {
        "code": 1567,
        "message": "AMM minted shares {0} are below minimum {1}",
        "name": "MinLpSharesNotMet"
      },
      {
        "code": 1568,
        "message": "AMM LP balance {0} is below requested burn {1}",
        "name": "InsufficientLpShares"
      },
      {
        "code": 1569,
        "message": "AMM liquidity output is below minimum",
        "name": "MinLiquidityOutputNotMet"
      },
      {
        "code": 1570,
        "message": "invalid hybrid swap protection or work limits",
        "name": "InvalidSwapParameter"
      },
      {
        "code": 1571,
        "message": "swap input token is not part of the market",
        "name": "InvalidSwapInputToken"
      },
      {
        "code": 1572,
        "message": "hybrid swap arithmetic overflow",
        "name": "SwapOverflow"
      },
      {
        "code": 1573,
        "message": "swap output {0} is below minimum {1}",
        "name": "MinSwapOutputNotMet"
      }
    ]
  },
  {
    "metadata": {
      "app_id": 7,
      "name": "validator",
      "description": "Milon validator app IDL"
    },
    "instructions": [
      {
        "args": [],
        "discriminator": 23268,
        "handler": "record_validator_activity",
        "kind": "entry",
        "name": "RecordValidatorActivity"
      },
      {
        "args": [
          {
            "name": "minimum_self_stake",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 54067,
        "handler": "bootstrap_validator_rules",
        "kind": "entry",
        "name": "BootstrapValidatorRules"
      },
      {
        "args": [
          {
            "name": "start_slot",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 32944,
        "handler": "freeze_validator_epoch",
        "kind": "entry",
        "name": "FreezeValidatorEpoch"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "validator",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 9901,
        "handler": "join_validator",
        "kind": "entry",
        "name": "JoinValidator"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "validator",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 47485,
        "handler": "exit_validator",
        "kind": "entry",
        "name": "ExitValidator"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "validator",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 39689,
        "handler": "top_up_self_stake",
        "kind": "entry",
        "name": "TopUpSelfStake"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "validator",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "config",
            "role": "input",
            "type": "PoolRewardConfig"
          }
        ],
        "discriminator": 17593,
        "handler": "request_pool_reward_config",
        "kind": "entry",
        "name": "RequestPoolRewardConfig"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "validator",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 50141,
        "handler": "claim_pool_commission",
        "kind": "entry",
        "name": "ClaimPoolCommission",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "validator",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 61791,
        "handler": "sweep_pool_residual",
        "kind": "entry",
        "name": "SweepPoolResidual",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "consensus_account",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "consensus_pubkey",
            "role": "input",
            "type": "bytes"
          },
          {
            "name": "bls_pubkey",
            "role": "input",
            "type": "bytes"
          },
          {
            "name": "bls_proof",
            "role": "input",
            "type": "bytes"
          },
          {
            "name": "ed25519_pubkey",
            "role": "input",
            "type": "bytes"
          },
          {
            "name": "self_stake",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "commission_rate_bps",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 51820,
        "handler": "register_validator",
        "kind": "entry",
        "name": "RegisterValidator",
        "returns": {
          "type": "B256"
        }
      },
      {
        "args": [],
        "discriminator": 15316,
        "handler": "settle_validator_epoch",
        "kind": "entry",
        "name": "SettleValidatorEpoch"
      },
      {
        "args": [],
        "discriminator": 43732,
        "handler": "validator_memberships",
        "kind": "view",
        "name": "ValidatorMemberships",
        "returns": {
          "type": "vec<Membership>"
        }
      },
      {
        "args": [],
        "discriminator": 32584,
        "handler": "current_validator_pools",
        "kind": "view",
        "name": "CurrentValidatorPools",
        "returns": {
          "type": "ValidatorPoolList"
        }
      },
      {
        "args": [
          {
            "name": "epoch",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 4719,
        "handler": "validator_proposal_activity",
        "kind": "view",
        "name": "ValidatorProposalActivity",
        "returns": {
          "type": "ProposalActivity"
        }
      },
      {
        "args": [
          {
            "name": "validator",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 37544,
        "handler": "validator_profile",
        "kind": "view",
        "name": "ValidatorProfile",
        "returns": {
          "type": "ValidatorProfile"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 10754,
        "handler": "validator_for_owner",
        "kind": "view",
        "name": "ValidatorForOwner",
        "returns": {
          "type": "B256"
        }
      },
      {
        "args": [
          {
            "name": "validator",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "target_epoch",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 13504,
        "handler": "validator_self_stake",
        "kind": "view",
        "name": "ValidatorSelfStake",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [],
        "discriminator": 19434,
        "handler": "registered_validators",
        "kind": "view",
        "name": "RegisteredValidators",
        "returns": {
          "type": "vec<B256>"
        }
      }
    ],
    "types": [
      {
        "fields": [
          {
            "name": "validator",
            "type": "B256"
          },
          {
            "name": "owner",
            "type": "Address"
          },
          {
            "name": "pool_id",
            "type": "B256"
          }
        ],
        "kind": "struct",
        "name": "ValidatorProfile",
        "typeTag": "13667524927300449050"
      },
      {
        "fields": [
          {
            "name": "validator",
            "type": "B256"
          },
          {
            "name": "consensus_account",
            "type": "Address"
          },
          {
            "name": "pool_id",
            "type": "B256"
          },
          {
            "name": "stake_asset",
            "type": "Address"
          },
          {
            "name": "reward_asset",
            "type": "Address"
          },
          {
            "name": "total_stake",
            "type": "u64"
          },
          {
            "name": "commission_rate_bps",
            "type": "u64"
          },
          {
            "name": "position_count",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "ValidatorPoolOverview",
        "typeTag": "17960705608572906744"
      },
      {
        "fields": [
          {
            "name": "epoch",
            "type": "u64"
          },
          {
            "name": "validator_set_hash",
            "type": "B256"
          },
          {
            "name": "validators",
            "type": "vec<ValidatorPoolOverview>"
          }
        ],
        "kind": "struct",
        "name": "ValidatorPoolList",
        "typeTag": "5183255326291536359"
      },
      {
        "fields": [
          {
            "name": "previous_set_hash",
            "type": "B256"
          },
          {
            "name": "freeze_block",
            "type": "u64"
          },
          {
            "name": "freeze_slot",
            "type": "u64"
          },
          {
            "name": "start_slot",
            "type": "u64"
          },
          {
            "name": "minimum_self_stake",
            "type": "u64"
          },
          {
            "name": "validator_set",
            "type": "bytes"
          }
        ],
        "kind": "struct",
        "name": "FrozenEpoch",
        "typeTag": "10270300266935636981"
      },
      {
        "fields": [
          {
            "name": "validator",
            "type": "B256"
          },
          {
            "name": "join_epoch",
            "type": "u64"
          },
          {
            "name": "exit_epoch",
            "type": "option<u64>"
          },
          {
            "name": "minimum_self_stake",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "Membership",
        "typeTag": "5003904180896082345"
      },
      {
        "fields": [
          {
            "name": "set_hash",
            "type": "B256"
          },
          {
            "name": "counts",
            "type": "vec<u64>"
          },
          {
            "name": "total",
            "type": "u64"
          },
          {
            "name": "last_block",
            "type": "u64"
          },
          {
            "name": "frozen",
            "type": "bool"
          },
          {
            "name": "denied",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "ProposalActivity",
        "typeTag": "195730631325514050"
      },
      {
        "fields": [
          {
            "name": "commission_rate_bps",
            "type": "u64"
          },
          {
            "name": "commission_recipient",
            "type": "Address"
          }
        ],
        "kind": "struct",
        "name": "PoolRewardConfig",
        "typeTag": "12365982797053730650"
      },
      {
        "kind": "builtin",
        "name": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "kind": "builtin",
        "name": "B256",
        "typeTag": "12016729314829497160"
      },
      {
        "kind": "builtin",
        "name": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "kind": "builtin",
        "name": "bytes",
        "typeTag": "10405529814227927951"
      },
      {
        "kind": "builtin",
        "name": "u64",
        "typeTag": "5563585020063213298"
      }
    ],
    "resources": [
      {
        "name": "_EpochSelfStake",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_FrozenEpoch",
        "type": "FrozenEpoch",
        "typeTag": "10270300266935636981"
      },
      {
        "name": "_Memberships",
        "type": "vec<Membership>",
        "typeTag": "16079097394413548312"
      },
      {
        "name": "_ProposalActivity",
        "type": "ProposalActivity",
        "typeTag": "195730631325514050"
      },
      {
        "name": "_ValidatorRecord",
        "type": "ValidatorProfile",
        "typeTag": "13667524927300449050"
      },
      {
        "name": "_RegisteredValidators",
        "type": "vec<B256>",
        "typeTag": "7359110152451899916"
      }
    ],
    "constants": [
      {
        "name": "MIN_SELF_STAKE",
        "type": "u64",
        "value": 1
      }
    ],
    "errors": [
      {
        "code": 1792,
        "message": "validator already registered: {0:?}",
        "name": "AlreadyRegistered"
      },
      {
        "code": 1793,
        "message": "validator not registered: {0:?}",
        "name": "NotRegistered"
      },
      {
        "code": 1794,
        "message": "signer is not the validator owner: {0:?}",
        "name": "OwnerMismatch"
      },
      {
        "code": 1795,
        "message": "consensus identity not registered: {0:?}",
        "name": "ConsensusIdentityMissing"
      },
      {
        "code": 1796,
        "message": "invalid validator parameter: {0}",
        "name": "InvalidParameters"
      },
      {
        "code": 1797,
        "message": "Transparent Token",
        "name": "Token",
        "transparent": true
      },
      {
        "code": 1798,
        "message": "Transparent Staking",
        "name": "Staking",
        "transparent": true
      },
      {
        "code": 1799,
        "message": "Transparent Context",
        "name": "Context",
        "transparent": true
      },
      {
        "code": 1800,
        "message": "validator set unavailable: {0}",
        "name": "ValidatorSetUnavailable"
      },
      {
        "code": 1801,
        "message": "Transparent Funds",
        "name": "Funds",
        "transparent": true
      }
    ]
  },
  {
    "metadata": {
      "app_id": 8,
      "name": "keyless",
      "description": "Milon keyless app IDL"
    },
    "instructions": [
      {
        "args": [],
        "discriminator": 7470,
        "handler": "bootstrap_keyless",
        "kind": "entry",
        "name": "BootstrapKeyless"
      },
      {
        "args": [
          {
            "name": "circuit_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "verifying_key",
            "role": "input",
            "type": "bytes"
          },
          {
            "name": "constraint_hash",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "max_public_inputs",
            "role": "input",
            "type": "u16"
          },
          {
            "name": "supported_algs",
            "role": "input",
            "type": "vec<String>"
          },
          {
            "name": "authentication_enabled",
            "role": "input",
            "type": "bool"
          }
        ],
        "discriminator": 18924,
        "handler": "install_zk_circuit",
        "kind": "entry",
        "name": "InstallZkCircuit"
      },
      {
        "args": [
          {
            "name": "provider_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "jwks",
            "role": "input",
            "type": "vec<String>"
          }
        ],
        "discriminator": 50524,
        "gas_exempt": true,
        "handler": "update_jwk_report",
        "kind": "entry",
        "name": "UpdateJwkReport",
        "requires_pq_signature": true,
        "validator": true,
        "validator_signer_mode": "any_signer"
      },
      {
        "args": [
          {
            "name": "provider_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "issuer",
            "role": "input",
            "type": "String"
          },
          {
            "name": "report_version",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "jwks",
            "role": "input",
            "type": "vec<String>"
          }
        ],
        "discriminator": 51814,
        "gas_exempt": true,
        "handler": "update_versioned_jwk_report",
        "kind": "entry",
        "name": "UpdateVersionedJwkReport",
        "requires_pq_signature": true,
        "validator": true,
        "validator_signer_mode": "any_signer"
      },
      {
        "args": [],
        "discriminator": 17484,
        "handler": "prune_inactive_jwk_reports",
        "kind": "entry",
        "name": "PruneInactiveJwkReports"
      },
      {
        "args": [
          {
            "name": "auth",
            "role": "input",
            "type": "Groth16Auth"
          }
        ],
        "discriminator": 21310,
        "handler": "authenticate",
        "kind": "entry",
        "name": "Authenticate",
        "sponsor": true
      },
      {
        "args": [
          {
            "name": "auth",
            "role": "input",
            "type": "Groth16Auth"
          },
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          }
        ],
        "discriminator": 59392,
        "handler": "bind",
        "kind": "entry",
        "name": "Bind"
      },
      {
        "args": [
          {
            "name": "keyless_addr",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          }
        ],
        "discriminator": 57503,
        "handler": "unbind",
        "kind": "entry",
        "name": "Unbind"
      },
      {
        "args": [
          {
            "name": "session_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          }
        ],
        "discriminator": 15722,
        "handler": "revoke_session",
        "kind": "entry",
        "name": "RevokeSession"
      },
      {
        "args": [
          {
            "name": "provider_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "audience",
            "role": "input",
            "type": "String"
          },
          {
            "name": "registrant",
            "role": "signer",
            "type": "Signer"
          }
        ],
        "discriminator": 44901,
        "handler": "register_audience",
        "kind": "entry",
        "name": "RegisterAudience"
      },
      {
        "args": [
          {
            "name": "display_name",
            "role": "input",
            "type": "String"
          },
          {
            "name": "issuer",
            "role": "input",
            "type": "String"
          },
          {
            "name": "salt",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "keys",
            "role": "input",
            "type": "vec<KeylessVerificationKey>"
          },
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          }
        ],
        "discriminator": 19418,
        "handler": "create_static_provider",
        "kind": "entry",
        "name": "CreateStaticProvider"
      },
      {
        "args": [
          {
            "name": "provider_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "keys",
            "role": "input",
            "type": "vec<KeylessVerificationKey>"
          },
          {
            "name": "invalidate_sessions",
            "role": "input",
            "type": "bool"
          },
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          }
        ],
        "discriminator": 19292,
        "handler": "update_static_provider_keys",
        "kind": "entry",
        "name": "UpdateStaticProviderKeys"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 58087,
        "handler": "get_sessions",
        "kind": "view",
        "name": "GetSessions",
        "returns": {
          "type": "vec<SessionEntry>"
        }
      },
      {
        "args": [
          {
            "name": "keyless_addr",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 4855,
        "handler": "get_binding",
        "kind": "view",
        "name": "GetBinding",
        "returns": {
          "type": "option<KeylessBinding>"
        }
      },
      {
        "args": [],
        "discriminator": 12570,
        "handler": "list_providers",
        "kind": "view",
        "name": "ListProviders",
        "returns": {
          "type": "vec<KeylessProvider>"
        }
      },
      {
        "args": [
          {
            "name": "provider_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 20071,
        "handler": "get_provider",
        "kind": "view",
        "name": "GetProvider",
        "returns": {
          "type": "option<KeylessProvider>"
        }
      },
      {
        "args": [
          {
            "name": "provider_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 62602,
        "handler": "get_provider_status",
        "kind": "view",
        "name": "GetProviderStatus",
        "returns": {
          "type": "option<KeylessProviderStatus>"
        }
      },
      {
        "args": [
          {
            "name": "validator",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "provider_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 44193,
        "handler": "get_jwk_report",
        "kind": "view",
        "name": "GetJwkReport",
        "returns": {
          "type": "option<ValidatorJwkReport>"
        }
      },
      {
        "args": [
          {
            "name": "validator",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "provider_id",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 40699,
        "handler": "get_versioned_jwk_report",
        "kind": "view",
        "name": "GetVersionedJwkReport",
        "returns": {
          "type": "option<VersionedValidatorJwkReport>"
        }
      },
      {
        "args": [
          {
            "name": "provider_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "issuer",
            "role": "input",
            "type": "String"
          },
          {
            "name": "kid",
            "role": "input",
            "type": "String"
          },
          {
            "name": "algorithm",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 65396,
        "handler": "get_selected_jwk",
        "kind": "view",
        "name": "GetSelectedJwk",
        "returns": {
          "type": "option<String>"
        }
      },
      {
        "args": [
          {
            "name": "provider_id",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "audience",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 13840,
        "handler": "get_audience",
        "kind": "view",
        "name": "GetAudience",
        "returns": {
          "type": "option<KeylessAudience>"
        }
      },
      {
        "args": [],
        "discriminator": 12312,
        "handler": "get_params",
        "kind": "view",
        "name": "GetParams",
        "returns": {
          "type": "KeylessParams"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 33494,
        "handler": "is_keyless_account",
        "kind": "view",
        "name": "IsKeylessAccount",
        "returns": {
          "type": "bool"
        }
      }
    ],
    "types": [
      {
        "kind": "enum",
        "name": "Groth16Error",
        "typeTag": "9192889819722184151",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "ProofEncoding"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "VerifyingKeyEncoding"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "PublicInputCount"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "UnsupportedEphemeralKey"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "CircuitIdMismatch"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "InvalidEnvelope"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "CircuitNotRegistered"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "CircuitDisabled"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "AlgorithmNotSupported"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "PublicInputSchemaMismatch"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "StringOrArray",
        "typeTag": "4792935557077212767",
        "variants": [
          {
            "fields": [
              {
                "name": "0",
                "type": "String"
              }
            ],
            "kind": "tuple",
            "name": "Single"
          },
          {
            "fields": [
              {
                "name": "0",
                "type": "vec<String>"
              }
            ],
            "kind": "tuple",
            "name": "Array"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "session_id",
            "type": "B256"
          },
          {
            "name": "provider_id",
            "type": "B256"
          },
          {
            "name": "audience_hash",
            "type": "B256"
          },
          {
            "name": "session_version",
            "type": "u64"
          },
          {
            "name": "session_pubkey",
            "type": "PublicKey"
          },
          {
            "name": "expires_at_ms",
            "type": "u64"
          },
          {
            "name": "created_at_ms",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "SessionEntry",
        "typeTag": "10717416294893905038"
      },
      {
        "fields": [
          {
            "name": "session_id",
            "type": "B256"
          },
          {
            "name": "valid_until_ms",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "RevokedSession",
        "typeTag": "10735777272269064136"
      },
      {
        "fields": [
          {
            "name": "sessions",
            "type": "vec<SessionEntry>"
          },
          {
            "name": "revoked",
            "type": "vec<RevokedSession>"
          }
        ],
        "kind": "struct",
        "name": "SessionsState",
        "typeTag": "12588480061968345616"
      },
      {
        "fields": [
          {
            "name": "max_session_ttl_ms",
            "type": "u64"
          },
          {
            "name": "bind_activation_delay_ms",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "KeylessParams",
        "typeTag": "7742804165053814138"
      },
      {
        "kind": "enum",
        "name": "KeylessProviderKind",
        "typeTag": "2153794636168183303",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "BuiltinOidc"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "StaticJwk"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "KeylessKeyMaterial",
        "typeTag": "15054311933159222178",
        "variants": [
          {
            "fields": [
              {
                "name": "modulus",
                "type": "bytes"
              },
              {
                "name": "exponent",
                "type": "bytes"
              }
            ],
            "kind": "struct",
            "name": "Rsa"
          },
          {
            "fields": [
              {
                "name": "x",
                "type": "B256"
              },
              {
                "name": "y",
                "type": "B256"
              }
            ],
            "kind": "struct",
            "name": "P256"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "kid",
            "type": "String"
          },
          {
            "name": "algorithm",
            "type": "String"
          },
          {
            "name": "material",
            "type": "KeylessKeyMaterial"
          }
        ],
        "kind": "struct",
        "name": "KeylessVerificationKey",
        "typeTag": "17417108057505386078"
      },
      {
        "fields": [
          {
            "name": "provider_id",
            "type": "B256"
          },
          {
            "name": "kind",
            "type": "KeylessProviderKind"
          },
          {
            "name": "display_name",
            "type": "String"
          },
          {
            "name": "issuer",
            "type": "String"
          },
          {
            "name": "allowed_algs",
            "type": "vec<String>"
          },
          {
            "name": "max_id_token_age_ms",
            "type": "u64"
          },
          {
            "name": "max_session_ttl_ms",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "option<Address>"
          },
          {
            "name": "keys",
            "type": "vec<KeylessVerificationKey>"
          },
          {
            "name": "key_revision",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "KeylessProvider",
        "typeTag": "6039969699975818265"
      },
      {
        "fields": [
          {
            "name": "enabled",
            "type": "bool"
          },
          {
            "name": "session_version",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "KeylessProviderStatus",
        "typeTag": "6015458750524898907"
      },
      {
        "fields": [
          {
            "name": "provider_id",
            "type": "B256"
          },
          {
            "name": "audience",
            "type": "String"
          },
          {
            "name": "registered_at_ms",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "KeylessAudience",
        "typeTag": "16732686633507861426"
      },
      {
        "fields": [
          {
            "name": "owner",
            "type": "Address"
          },
          {
            "name": "slot_index",
            "type": "u8"
          },
          {
            "name": "bound_at_ms",
            "type": "u64"
          },
          {
            "name": "active_at_ms",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "KeylessBinding",
        "typeTag": "7983738404475004213"
      },
      {
        "fields": [
          {
            "name": "provider_id",
            "type": "B256"
          },
          {
            "name": "audience_hash",
            "type": "B256"
          },
          {
            "name": "bound_at_ms",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "KeylessMarker",
        "typeTag": "13733160811629473206"
      },
      {
        "fields": [
          {
            "name": "entries",
            "type": "vec<B256>"
          }
        ],
        "kind": "struct",
        "name": "ProviderIndex",
        "typeTag": "15624622551745873749"
      },
      {
        "fields": [
          {
            "name": "validator",
            "type": "B256"
          },
          {
            "name": "keys",
            "type": "vec<String>"
          }
        ],
        "kind": "struct",
        "name": "ValidatorJwkReport",
        "typeTag": "9801215955308508226"
      },
      {
        "fields": [
          {
            "name": "reports",
            "type": "vec<ValidatorJwkReport>"
          }
        ],
        "kind": "struct",
        "name": "KeylessJwkReports",
        "typeTag": "5913680928839638407"
      },
      {
        "fields": [
          {
            "name": "validator",
            "type": "B256"
          },
          {
            "name": "issuer",
            "type": "String"
          },
          {
            "name": "report_version",
            "type": "u64"
          },
          {
            "name": "keys",
            "type": "vec<String>"
          }
        ],
        "kind": "struct",
        "name": "VersionedValidatorJwkReport",
        "typeTag": "4681731807847511843"
      },
      {
        "fields": [
          {
            "name": "reports",
            "type": "vec<VersionedValidatorJwkReport>"
          }
        ],
        "kind": "struct",
        "name": "KeylessVersionedJwkReports",
        "typeTag": "16210363338209716802"
      },
      {
        "fields": [
          {
            "name": "circuit_id",
            "type": "u32"
          },
          {
            "name": "verifying_key",
            "type": "bytes"
          },
          {
            "name": "constraint_hash",
            "type": "B256"
          },
          {
            "name": "max_public_inputs",
            "type": "u16"
          },
          {
            "name": "supported_algs",
            "type": "vec<String>"
          },
          {
            "name": "enabled",
            "type": "bool"
          },
          {
            "name": "authentication_enabled",
            "type": "bool"
          }
        ],
        "kind": "struct",
        "name": "KeylessZkCircuit",
        "typeTag": "2044003146433446322"
      },
      {
        "kind": "enum",
        "name": "PublicStatementError",
        "typeTag": "7938151067451673625",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "InvalidJwk"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "InvalidEphemeralKey"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "TooLarge"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "InvalidEnvelope"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "circuit_id",
            "type": "u32"
          },
          {
            "name": "claim",
            "type": "ZkAuthClaim"
          },
          {
            "name": "proof",
            "type": "bytes"
          }
        ],
        "kind": "struct",
        "name": "Groth16Auth",
        "typeTag": "16964812385002816684"
      },
      {
        "fields": [
          {
            "name": "chain_id",
            "type": "u64"
          },
          {
            "name": "provider_id",
            "type": "B256"
          },
          {
            "name": "issuer",
            "type": "String"
          },
          {
            "name": "algorithm",
            "type": "String"
          },
          {
            "name": "kid",
            "type": "String"
          },
          {
            "name": "jwk_thumbprint",
            "type": "String"
          },
          {
            "name": "audience_hash",
            "type": "B256"
          },
          {
            "name": "address_seed",
            "type": "B256"
          },
          {
            "name": "ephemeral_pk",
            "type": "PublicKey"
          },
          {
            "name": "iat_s",
            "type": "u64"
          },
          {
            "name": "exp_s",
            "type": "u64"
          },
          {
            "name": "session_expiry_ms",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "ZkAuthClaim",
        "typeTag": "4485551589117502468"
      },
      {
        "kind": "builtin",
        "name": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "kind": "builtin",
        "name": "B256",
        "typeTag": "12016729314829497160"
      },
      {
        "kind": "builtin",
        "name": "PublicKey",
        "typeTag": "12784977254987571496"
      },
      {
        "kind": "builtin",
        "name": "String",
        "typeTag": "8566531010829758022"
      },
      {
        "kind": "builtin",
        "name": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "kind": "builtin",
        "name": "bytes",
        "typeTag": "10405529814227927951"
      },
      {
        "kind": "builtin",
        "name": "u16",
        "typeTag": "5558799945458185151"
      },
      {
        "kind": "builtin",
        "name": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "kind": "builtin",
        "name": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "kind": "builtin",
        "name": "u8",
        "typeTag": "631772817358541784"
      }
    ],
    "resources": [
      {
        "name": "_KeylessSessions",
        "type": "SessionsState",
        "typeTag": "12588480061968345616"
      },
      {
        "name": "_KeylessParams",
        "type": "KeylessParams",
        "typeTag": "7742804165053814138"
      },
      {
        "name": "_KeylessProvider",
        "type": "KeylessProvider",
        "typeTag": "6039969699975818265"
      },
      {
        "name": "_KeylessProviderStatus",
        "type": "KeylessProviderStatus",
        "typeTag": "6015458750524898907"
      },
      {
        "name": "_KeylessAudience",
        "type": "KeylessAudience",
        "typeTag": "16732686633507861426"
      },
      {
        "name": "_KeylessBinding",
        "type": "KeylessBinding",
        "typeTag": "7983738404475004213"
      },
      {
        "name": "_KeylessMarker",
        "type": "KeylessMarker",
        "typeTag": "13733160811629473206"
      },
      {
        "name": "_ProviderIndex",
        "type": "ProviderIndex",
        "typeTag": "15624622551745873749"
      },
      {
        "name": "_KeylessJwkReports",
        "type": "KeylessJwkReports",
        "typeTag": "5913680928839638407"
      },
      {
        "name": "_KeylessVersionedJwkReports",
        "type": "KeylessVersionedJwkReports",
        "typeTag": "16210363338209716802"
      },
      {
        "name": "_KeylessZkCircuit",
        "type": "KeylessZkCircuit",
        "typeTag": "2044003146433446322"
      }
    ],
    "constants": [
      {
        "name": "MAX_SIGNING_HEADER_BYTES",
        "type": "usize",
        "value": 1024
      },
      {
        "name": "MAX_SIGNING_PAYLOAD_BYTES",
        "type": "usize",
        "value": 4096
      },
      {
        "name": "KEYLESS_SPONSOR_SEED",
        "type": "u64",
        "value": 0
      },
      {
        "name": "KEYLESS_SPONSOR_MINT",
        "type": "u64",
        "value": "1_000_000 * 1_000_000"
      },
      {
        "name": "BUILTIN_PROVIDER_TAG",
        "type": "u8",
        "value": 0
      },
      {
        "name": "STATIC_PROVIDER_TAG",
        "type": "u8",
        "value": 1
      },
      {
        "name": "GOOGLE_PROVIDER_ID",
        "type": "B256",
        "value": "builtin_provider_id (b\"GOOGLE_OIDC_V1\")"
      },
      {
        "name": "APPLE_PROVIDER_ID",
        "type": "B256",
        "value": "builtin_provider_id (b\"APPLE_OIDC_V1\")"
      },
      {
        "name": "MAX_ZK_VERIFYING_KEY_BYTES",
        "type": "usize",
        "value": "64 * 1024"
      },
      {
        "name": "COMPACT_RS256_DEV_R1CS_HASH",
        "type": "B256",
        "value": "[0x08 , 0x21 , 0x6D , 0x61 , 0x7A , 0x2D , 0xB0 , 0x48 , 0x2D , 0xD3 , 0xD7 , 0x12 , 0x9F , 0x6F , 0x9C , 0xEC , 0x11 , 0x6E , 0xE2 , 0x3B , 0x56 , 0xAC , 0x3E , 0x08 , 0xE1 , 0x3E , 0xC4 , 0x26 , 0xA6 , 0x29 , 0x43 , 0x0D ,]"
      },
      {
        "name": "COMPACT_RS256_DEV_VK_ACTIVATION_SHA256",
        "type": "B256",
        "value": "[0x32 , 0xA1 , 0x7D , 0x5C , 0x42 , 0x54 , 0xA0 , 0xCE , 0x53 , 0x46 , 0x09 , 0xE5 , 0xC8 , 0x5D , 0x27 , 0x3A , 0x95 , 0xC8 , 0x8D , 0x26 , 0xAC , 0x89 , 0x2B , 0x98 , 0x15 , 0xA7 , 0x48 , 0x5C , 0x2F , 0x7F , 0x6A , 0x28 ,]"
      },
      {
        "name": "COMPACT_RS256_DEV_VK_BYTES",
        "type": "bytes",
        "value": "& [0xE2 , 0xF2 , 0x6D , 0xBE , 0xA2 , 0x99 , 0xF5 , 0x22 , 0x3B , 0x64 , 0x6C , 0xB1 , 0xFB , 0x33 , 0xEA , 0xDB , 0x05 , 0x9D , 0x94 , 0x07 , 0x55 , 0x9D , 0x74 , 0x41 , 0xDF , 0xD9 , 0x02 , 0xE3 , 0xA7 , 0x9A , 0x4D , 0x2D , 0xAB , 0xB7 , 0x3D , 0xC1 , 0x7F , 0xBC , 0x13 , 0x02 , 0x1E , 0x24 , 0x71 , 0xE0 , 0xC0 , 0x8B , 0xD6 , 0x7D , 0x84 , 0x01 , 0xF5 , 0x2B , 0x73 , 0xD6 , 0xD0 , 0x74 , 0x83 , 0x79 , 0x4C , 0xAD , 0x47 , 0x78 , 0x18 , 0x0E , 0x0C , 0x06 , 0xF3 , 0x3B , 0xBC , 0x4C , 0x79 , 0xA9 , 0xCA , 0xDE , 0xF2 , 0x53 , 0xA6 , 0x80 , 0x84 , 0xD3 , 0x82 , 0xF1 , 0x77 , 0x88 , 0xF8 , 0x85 , 0xC9 , 0xAF , 0xD1 , 0x76 , 0xF7 , 0xCB , 0x2F , 0x03 , 0x67 , 0x89 , 0xED , 0xF6 , 0x92 , 0xD9 , 0x5C , 0xBD , 0xDE , 0x46 , 0xDD , 0xDA , 0x5E , 0xF7 , 0xD4 , 0x22 , 0x43 , 0x67 , 0x79 , 0x44 , 0x5C , 0x5E , 0x66 , 0x00 , 0x6A , 0x42 , 0x76 , 0x1E , 0x1F , 0x12 , 0xEF , 0xDE , 0x00 , 0x18 , 0xC2 , 0x12 , 0xF3 , 0xAE , 0xB7 , 0x85 , 0xE4 , 0x97 , 0x12 , 0xE7 , 0xA9 , 0x35 , 0x33 , 0x49 , 0xAA , 0xF1 , 0x25 , 0x5D , 0xFB , 0x31 , 0xB7 , 0xBF , 0x60 , 0x72 , 0x3A , 0x48 , 0x0D , 0x92 , 0x93 , 0x93 , 0x8E , 0x19 , 0x0D , 0x39 , 0xD7 , 0xB0 , 0x4E , 0xAE , 0xA7 , 0x0E , 0xA1 , 0xCB , 0xB7 , 0x31 , 0x0F , 0x4A , 0x4C , 0xAA , 0x0D , 0xA7 , 0x0B , 0xA6 , 0x1B , 0x71 , 0xDB , 0xDF , 0x6D , 0xED , 0x59 , 0x3B , 0x7E , 0xD0 , 0x22 , 0x0A , 0x8A , 0x39 , 0x2A , 0xC7 , 0x22 , 0x07 , 0xAA , 0xE6 , 0xA0 , 0xFB , 0xB7 , 0xF3 , 0x2A , 0x5C , 0x41 , 0x4F , 0x3F , 0x52 , 0xC9 , 0xD9 , 0x6E , 0x43 , 0x92 , 0x0C , 0x0E , 0xD0 , 0xAD , 0xA5 , 0x02 , 0x24 , 0xA8 , 0xA6 , 0x16 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x00 , 0x1E , 0x3F , 0xF0 , 0xB7 , 0x50 , 0xE6 , 0x42 , 0xBA , 0x6D , 0xB8 , 0xEE , 0x47 , 0xE6 , 0x34 , 0x5F , 0x39 , 0x77 , 0xC8 , 0xBD , 0x80 , 0x65 , 0x4B , 0x4C , 0x67 , 0xB8 , 0x6A , 0x4B , 0xBA , 0xE6 , 0x0E , 0x70 , 0x8F , 0xDB , 0x23 , 0x67 , 0x26 , 0xCD , 0x80 , 0x1F , 0x36 , 0xC1 , 0xD9 , 0x7E , 0xCC , 0x8B , 0x6D , 0xB6 , 0x4B , 0x5C , 0xF3 , 0x5D , 0x64 , 0x2D , 0x38 , 0xF1 , 0x2D , 0x3F , 0xC6 , 0xAA , 0x3E , 0x2E , 0x44 , 0x7F , 0x0B , 0x36 , 0xAA , 0xD8 , 0xF6 , 0x6D , 0x0A , 0xE4 , 0xC7 , 0xEA , 0x4F , 0x74 , 0x7A , 0xA4 , 0x11 , 0x43 , 0x31 , 0xE3 , 0x30 , 0x24 , 0x6E , 0x02 , 0x6D , 0xB0 , 0x4D , 0xD1 , 0x61 , 0x45 , 0x76 , 0x81 , 0x5E , 0x6A , 0x1B , 0x3E , 0xC3 , 0xAE , 0x02 , 0x0F , 0x0C , 0xB8 , 0xBB , 0xD5 , 0x2E , 0xA6 , 0x7F , 0x3D , 0x92 , 0x3C , 0x91 , 0x07 , 0xDA , 0x5E , 0x71 , 0xF4 , 0x8D , 0xEF , 0x7A , 0xF2 , 0xB7 , 0x6C , 0xC6 , 0xC4 , 0x57 , 0x55 , 0x0F , 0x66 , 0x37 , 0xCE , 0x4E , 0x63 , 0xF0 , 0xE9 , 0x5B , 0xE8 , 0x6D , 0xC5 , 0x53 , 0xCF , 0x92 , 0x4A , 0x68 , 0x62 , 0xC6 , 0x8F , 0x42 , 0x9D , 0x67 , 0x2B , 0x45 , 0xCC , 0x14 , 0xB1 , 0x56 , 0x6A , 0xE8 , 0x0F , 0x04 , 0xD2 , 0x36 , 0x9C , 0xD7 , 0xC0 , 0x24 , 0x31 , 0x0A , 0x06 , 0xDC , 0xEF , 0x2F , 0xD5 , 0x89 , 0x77 , 0x33 , 0xA2 , 0xE9 , 0x25 , 0xD4 , 0x0B , 0x1F , 0xCD , 0xBB , 0x52 , 0x42 , 0xC3 , 0xF2 , 0x0E , 0x05 , 0x89 , 0x96 , 0x96 , 0xCD , 0x80 , 0x15 , 0x81 , 0x43 , 0x72 , 0x94 , 0x95 , 0x1A , 0xF2 , 0x0B , 0x5B , 0xFB , 0x5A , 0x6B , 0x1E , 0xFF , 0x36 , 0x02 , 0x81 , 0x6B , 0xAB , 0xBF , 0xAD , 0xD4 , 0x65 , 0x0B , 0x37 , 0xA0 , 0x65 , 0x0A , 0x1F , 0xB3 , 0x79 , 0x2A , 0x81 , 0x8F , 0x86 , 0x27 , 0x27 , 0xC0 , 0x1C , 0x65 , 0x91 , 0xFF , 0x0A , 0x91 , 0x46 , 0x4E , 0xE9 , 0xD5 , 0x75 , 0x9B , 0x15 , 0x9F , 0xBC , 0xDE , 0x8C , 0x27 , 0x92 , 0xF2 , 0x19 , 0xA5 , 0xAA , 0xD3 , 0xA2 , 0x28 , 0xB5 , 0xBB , 0x41 , 0x10 , 0x2C , 0xC0 , 0x55 , 0xA2 , 0x09 , 0xA0 , 0x75 , 0x5F , 0x04 , 0x2D , 0x12 , 0x61 , 0xB0 , 0x7B , 0x4C , 0x99 , 0x23 , 0x48 , 0x13 , 0xB1 , 0xEF , 0x13 , 0x4C , 0x9B , 0x8F , 0xA0 , 0x98 , 0xC4 , 0xFA , 0xB0 , 0xF5 , 0x0A , 0xBF , 0xDB , 0x73 , 0x7D , 0x8F , 0x48 , 0x8B , 0xA3 , 0x9E , 0xBE , 0x82 , 0x35 , 0x9E , 0xD9 , 0x81 , 0xD9 , 0x61 , 0xAB , 0xB8 , 0xC1 , 0x1F , 0x51 , 0x56 , 0x21 , 0xF3 , 0x9D , 0x1C , 0x54 , 0x0B , 0xF9 , 0x6D , 0x74 , 0x6D , 0x22 , 0xEA , 0x6D , 0xDA , 0xF9 , 0x21 , 0xD2 , 0x9C , 0x4F , 0xBE , 0x31 , 0x66 , 0x36 , 0x1F , 0x62 , 0x2F , 0xE9 , 0x86 , 0x2E , 0xAD , 0x3E , 0x4A , 0x8C , 0x0C , 0xBF , 0x6E , 0x7D , 0x67 , 0x80 , 0x23 , 0xBD , 0xB6 , 0x10 , 0x72 , 0xA1 , 0x47 , 0xEB , 0x6A , 0x75 , 0x55 , 0x89 , 0x0E , 0xEA , 0xF1 , 0x58 , 0xB2 , 0x2B , 0xC5 , 0x64 , 0xF5 , 0x02 , 0x44 , 0x8A , 0x89 , 0x9E , 0x44 , 0x42 , 0xEB , 0x2C , 0x41 , 0xC8 , 0xF3 , 0x6B , 0x9A , 0xFB , 0xC5 , 0x44 , 0xBD , 0x44 , 0x26 , 0xAF , 0xC0 , 0x09 , 0xC7 , 0xA3 , 0xC5 , 0xB6 , 0x36 , 0xCD , 0x42 , 0x41 , 0x08 , 0x0A , 0xE0 , 0x04 , 0x65 , 0xA1 , 0x59 , 0x16 , 0xD4 , 0xF8 , 0x4F , 0x71 , 0xAF , 0x7A , 0x61 , 0x2C , 0x6D , 0x9E , 0x14 , 0xAE , 0xF1 , 0xCB , 0x87 , 0x13 , 0x36 , 0x78 , 0x85 , 0xB2 , 0x86 , 0xC2 , 0x84 , 0x72 , 0x95 , 0x9D , 0x32 , 0xF9 , 0x58 , 0x19 , 0x7A , 0x7A , 0xD8 , 0x3E , 0x2E , 0xCE , 0xA1 , 0xE7 , 0xBE , 0x61 , 0x0E , 0x6D , 0x4A , 0x45 , 0x37 , 0x6C , 0xE4 , 0xA7 , 0x4A , 0x63 , 0x58 , 0x8E , 0xB0 , 0x2A , 0x60 , 0x76 , 0x07 , 0xB0 , 0xB7 , 0xE9 , 0x5E , 0x2E , 0xFD , 0xE2 , 0x0C , 0x35 , 0x7C , 0x1C , 0x39 , 0xDC , 0xDF , 0xC8 , 0x57 , 0x25 , 0x2D , 0x33 , 0xE8 , 0xB2 , 0x3A , 0xA8 , 0x86 , 0x7C , 0xE8 , 0xAE , 0xFD , 0xEC , 0x94 , 0x57 , 0x89 , 0xA8 , 0xA6 , 0xAE , 0x84 , 0x03 , 0x14 , 0x8F , 0x83 , 0xC6 , 0xBE , 0xCC , 0x94 , 0xEF , 0xB3 , 0xB3 , 0x37 , 0xB6 , 0x5C , 0x53 , 0x26 , 0x8F , 0xE4 , 0x04 , 0xA1 , 0x06 , 0xF0 , 0x12 , 0x4A , 0x26 , 0xF0 , 0x43 , 0xCE , 0x29 , 0x55 , 0x59 , 0x08 , 0x25 , 0x06 , 0xF0 , 0xD3 , 0x7C , 0x85 , 0x22 , 0x70 , 0x8B , 0x08 , 0xC5 , 0x49 , 0x6F , 0xB8 , 0xEE , 0xC9 , 0x76 , 0x63 , 0x0C , 0x95 , 0x65 , 0x2E , 0xBC , 0xDD , 0xEE , 0xEF , 0x07 , 0xB2 , 0x23 , 0x28 , 0xD5 , 0xEC , 0x0C , 0x34 , 0xFB , 0xC3 , 0x30 , 0xB4 , 0x6B , 0xEA , 0x70 , 0x1E , 0xD2 , 0x09 , 0x6B , 0x05 , 0x4C , 0x3A , 0xC4 , 0xE3 , 0x7A , 0x32 , 0x8E , 0x12 , 0x29 , 0xC9 , 0x9E , 0xA7 , 0x0A , 0xA2 , 0xEF , 0xAC , 0xEB , 0xAF , 0x86 , 0xD3 , 0xF3 , 0xA0 , 0x59 , 0x29 , 0x96 , 0x41 , 0x71 , 0xE7 , 0x85 , 0xFB , 0x09 , 0x6E , 0x48 , 0x7C , 0xC4 , 0x4E , 0xDB , 0xAA , 0xB3 , 0x0E , 0xCC , 0x9B , 0x2F , 0x7D , 0x1D , 0x2C , 0x8F , 0xCB , 0x30 , 0x72 , 0x00 , 0xC3 , 0xB5 , 0x88 , 0x0B , 0xBB , 0x3F , 0x6E , 0x62 , 0x0C , 0xD4 , 0x2C , 0x93 , 0x71 , 0xD7 , 0x17 , 0x46 , 0xA6 , 0x9B , 0x2D , 0xEF , 0x33 , 0xD7 , 0x96 , 0x88 , 0xCF , 0x40 , 0xBB , 0x10 , 0xFC , 0x86 , 0x17 , 0x0D , 0xDF , 0x5B , 0x5A , 0x67 , 0x37 , 0x66 , 0xDF , 0x62 , 0x7D , 0x3A , 0x92 , 0x3C , 0x8C , 0x6C , 0x3B , 0x8E , 0x71 , 0xF7 , 0xAD , 0x85 , 0xFA , 0xD9 , 0x9B , 0x87 , 0x1C , 0x8C , 0xB9 , 0xB5 , 0x4F , 0xCA , 0x47 , 0xAE ,]"
      },
      {
        "name": "DEFAULT_MAX_SESSION_TTL_MS",
        "type": "u64",
        "value": 86400000
      },
      {
        "name": "DEFAULT_BIND_ACTIVATION_DELAY_MS",
        "type": "u64",
        "value": 86400000
      },
      {
        "name": "SESSION_TTL_CEILING_MS",
        "type": "u64",
        "value": 604800000
      },
      {
        "name": "BIND_DELAY_FLOOR_MS",
        "type": "u64",
        "value": 3600000
      },
      {
        "name": "SHA256_DIGEST_INFO_PREFIX",
        "type": "array<u8;19>",
        "value": "[0x30 , 0x31 , 0x30 , 0x0D , 0x06 , 0x09 , 0x60 , 0x86 , 0x48 , 0x01 , 0x65 , 0x03 , 0x04 , 0x02 , 0x01 , 0x05 , 0x00 , 0x04 , 0x20 ,]"
      },
      {
        "name": "RSA2048_MODULUS_BYTES",
        "type": "usize",
        "value": 256
      },
      {
        "name": "RSA2048_SIGNATURE_BYTES",
        "type": "usize",
        "value": "RSA2048_MODULUS_BYTES"
      },
      {
        "name": "RSA2048_LIMBS",
        "type": "usize",
        "value": "RSA2048_MODULUS_BYTES / 4"
      },
      {
        "name": "RSA2048_PRODUCT_LIMBS",
        "type": "usize",
        "value": "RSA2048_LIMBS * 2"
      },
      {
        "name": "RSA_MAX_EXPONENT_BYTES",
        "type": "usize",
        "value": 4
      },
      {
        "name": "COMPACT_STAGED_JWT_RS256_CIRCUIT_ID",
        "type": "u32",
        "value": 5
      },
      {
        "name": "STAGED_JWT_PUBLIC_INPUTS",
        "type": "u16",
        "value": 21
      },
      {
        "name": "MAX_GROTH16_PROOF_BYTES",
        "type": "usize",
        "value": 256
      },
      {
        "name": "MAX_ZK_ISSUER_BYTES",
        "type": "usize",
        "value": 512
      },
      {
        "name": "MAX_ZK_KID_BYTES",
        "type": "usize",
        "value": 256
      },
      {
        "name": "MAX_ZK_THUMBPRINT_BYTES",
        "type": "usize",
        "value": 128
      }
    ],
    "errors": [
      {
        "code": 2048,
        "message": "JWT is not valid UTF-8",
        "name": "JwtInvalidUtf8"
      },
      {
        "code": 2049,
        "message": "JWT must have 3 dot-separated parts",
        "name": "JwtInvalidFormat"
      },
      {
        "code": 2050,
        "message": "JWT base64 decode failed",
        "name": "JwtBase64Decode"
      },
      {
        "code": 2051,
        "message": "JWT header parse failed",
        "name": "JwtHeaderParse"
      },
      {
        "code": 2052,
        "message": "JWT payload parse failed",
        "name": "JwtPayloadParse"
      },
      {
        "code": 2053,
        "message": "JWT missing required field: iss",
        "name": "JwtMissingIss"
      },
      {
        "code": 2054,
        "message": "JWT missing required field: sub",
        "name": "JwtMissingSub"
      },
      {
        "code": 2055,
        "message": "JWT subject exceeds the Keyless hash profile limit",
        "name": "JwtSubjectTooLong"
      },
      {
        "code": 2056,
        "message": "JWT missing required field: exp",
        "name": "JwtMissingExp"
      },
      {
        "code": 2057,
        "message": "JWT missing required field: iat",
        "name": "JwtMissingIat"
      },
      {
        "code": 2058,
        "message": "JWT missing required field: nonce",
        "name": "JwtMissingNonce"
      },
      {
        "code": 2059,
        "message": "JWT missing required field: kid in header",
        "name": "JwtMissingKid"
      },
      {
        "code": 2060,
        "message": "JWT expired: exp={0} ms",
        "name": "JwtExpired"
      },
      {
        "code": 2061,
        "message": "JWT issued in the future: iat={0} ms",
        "name": "JwtIssuedInFuture"
      },
      {
        "code": 2062,
        "message": "JWT is too old: age={0} ms",
        "name": "JwtTooOld"
      },
      {
        "code": 2063,
        "message": "JWT issuer does not match provider: expected={0}, got={1}",
        "name": "JwtIssuerMismatch"
      },
      {
        "code": 2064,
        "message": "JWT audience is not allowed by provider",
        "name": "JwtAudienceNotAllowed"
      },
      {
        "code": 2065,
        "message": "multi-audience JWT requires a matching azp",
        "name": "JwtAzpInvalid"
      },
      {
        "code": 2066,
        "message": "JWT algorithm not supported: {0}",
        "name": "JwtAlgorithmUnsupported"
      },
      {
        "code": 2067,
        "message": "JWT signature verification failed",
        "name": "JwtSignatureInvalid"
      },
      {
        "code": 2068,
        "message": "nonce must start with 'milon-keyless-v1.'",
        "name": "NoncePrefixInvalid"
      },
      {
        "code": 2069,
        "message": "nonce binary envelope is malformed",
        "name": "NonceFormatInvalid"
      },
      {
        "code": 2070,
        "message": "nonce commitment must be 64 hex characters (32 bytes)",
        "name": "NonceCommitmentLength"
      },
      {
        "code": 2071,
        "message": "nonce commitment hex decode failed",
        "name": "NonceCommitmentHex"
      },
      {
        "code": 2072,
        "message": "nonce expiry parse failed",
        "name": "NonceExpiryParse"
      },
      {
        "code": 2073,
        "message": "nonce chain ID mismatch: expected={0}, got={1}",
        "name": "NonceChainIdMismatch"
      },
      {
        "code": 2074,
        "message": "nonce provider ID mismatch",
        "name": "NonceProviderMismatch"
      },
      {
        "code": 2075,
        "message": "nonce commitment mismatch (ephemeral_pk does not match JWT nonce)",
        "name": "NonceCommitmentMismatch"
      },
      {
        "code": 2076,
        "message": "nonce expired: expiry={0} ms",
        "name": "NonceExpired"
      },
      {
        "code": 2077,
        "message": "JWK not found: issuer={0}, kid={1}",
        "name": "JwkNotFound"
      },
      {
        "code": 2078,
        "message": "JWK parse failed",
        "name": "JwkParse"
      },
      {
        "code": 2079,
        "message": "JWK key type mismatch: expected {0}, got {1}",
        "name": "JwkKeyTypeMismatch"
      },
      {
        "code": 2080,
        "message": "JWK missing required field: {0}",
        "name": "JwkMissingField"
      },
      {
        "code": 2081,
        "message": "JWK base64 decode failed",
        "name": "JwkBase64Decode"
      },
      {
        "code": 2082,
        "message": "JWK invalid RSA key",
        "name": "JwkInvalidRsaKey"
      },
      {
        "code": 2083,
        "message": "JWK invalid EC key",
        "name": "JwkInvalidEcKey"
      },
      {
        "code": 2084,
        "message": "JWK curve mismatch: alg={0}, crv={1}",
        "name": "JwkCurveMismatch"
      },
      {
        "code": 2085,
        "message": "ephemeral signature invalid",
        "name": "EphemeralSignatureInvalid"
      },
      {
        "code": 2086,
        "message": "timestamp skew too large: {0} ms exceeds limit",
        "name": "TimestampSkewTooLarge"
      },
      {
        "code": 2087,
        "message": "session expire out of range: {0}",
        "name": "SessionExpireOutOfRange"
      },
      {
        "code": 2088,
        "message": "legacy mock verifier rejects non-empty proof bytes",
        "name": "MockProofNotEmpty"
      },
      {
        "code": 2089,
        "message": "session pubkey must be a real signature key",
        "name": "InvalidSessionPubkey"
      },
      {
        "code": 2090,
        "message": "session is revoked: {0:?}",
        "name": "SessionRevoked"
      },
      {
        "code": 2091,
        "message": "public sponsorship already used for session: {0:?}",
        "name": "SessionSponsorshipAlreadyUsed"
      },
      {
        "code": 2092,
        "message": "keyless provider not registered: {0:?}",
        "name": "ProviderNotRegistered"
      },
      {
        "code": 2093,
        "message": "keyless provider already registered: {0:?}",
        "name": "ProviderAlreadyRegistered"
      },
      {
        "code": 2094,
        "message": "keyless provider is disabled or not active: {0:?}",
        "name": "ProviderDisabled"
      },
      {
        "code": 2095,
        "message": "issuer URL must start with https://",
        "name": "IssuerUrlInvalid"
      },
      {
        "code": 2096,
        "message": "issuer name must be non-empty and at most 64 bytes",
        "name": "IssuerNameInvalid"
      },
      {
        "code": 2097,
        "message": "duplicate jwk entries in key set",
        "name": "DuplicateJwk"
      },
      {
        "code": 2098,
        "message": "session not found: {0:?}",
        "name": "SessionNotFound"
      },
      {
        "code": 2099,
        "message": "keyless identity already bound: {0:?}",
        "name": "AlreadyBound"
      },
      {
        "code": 2100,
        "message": "keyless binding not found: {0:?}",
        "name": "BindingNotFound"
      },
      {
        "code": 2101,
        "message": "keyless binding owner mismatch: binding={0:?}, signer={1:?}",
        "name": "BindingOwnerMismatch"
      },
      {
        "code": 2102,
        "message": "binding signer slot no longer matches keyless identity: {0:?}",
        "name": "BindingSignerMismatch"
      },
      {
        "code": 2103,
        "message": "keyless signer slot not found in owner account",
        "name": "KeylessSlotNotFound"
      },
      {
        "code": 2104,
        "message": "JWT base64url encoding is not canonical",
        "name": "JwtBase64NonCanonical"
      },
      {
        "code": 2105,
        "message": "JWK snapshot unavailable for provider: {0:?}",
        "name": "JwkSnapshotUnavailable"
      },
      {
        "code": 2106,
        "message": "Transparent AccountError",
        "name": "AccountError",
        "transparent": true
      },
      {
        "code": 2107,
        "message": "Transparent TokenError",
        "name": "TokenError",
        "transparent": true
      },
      {
        "code": 2108,
        "message": "JWT algorithm is supported but not allowed by provider: {0}",
        "name": "JwtAlgorithmNotAllowed"
      },
      {
        "code": 2109,
        "message": "JWK algorithm mismatch: expected={0}, got={1}",
        "name": "JwkAlgorithmMismatch"
      },
      {
        "code": 2110,
        "message": "JWK use must be 'sig', got={0}",
        "name": "JwkUseInvalid"
      },
      {
        "code": 2111,
        "message": "JWK key_ops must contain 'verify'",
        "name": "JwkKeyOpsInvalid"
      },
      {
        "code": 2112,
        "message": "provider allowed algorithms contain duplicates",
        "name": "DuplicateAlgorithm"
      },
      {
        "code": 2113,
        "message": "keyless bootstrap is only valid in genesis block 0",
        "name": "GenesisOnly"
      },
      {
        "code": 2114,
        "message": "keyless registry is already bootstrapped",
        "name": "AlreadyBootstrapped"
      },
      {
        "code": 2115,
        "message": "keyless provider kind or ID namespace is invalid",
        "name": "ProviderKindInvalid"
      },
      {
        "code": 2116,
        "message": "provider session version overflow",
        "name": "SessionVersionOverflow"
      },
      {
        "code": 2117,
        "message": "provider key revision overflow",
        "name": "KeyRevisionOverflow"
      },
      {
        "code": 2118,
        "message": "audience must contain 1..=256 UTF-8 bytes",
        "name": "AudienceInvalid"
      },
      {
        "code": 2119,
        "message": "audience hash collision",
        "name": "AudienceHashCollision"
      },
      {
        "code": 2120,
        "message": "JWT audience array is empty or contains duplicates",
        "name": "JwtAudienceInvalid"
      },
      {
        "code": 2121,
        "message": "provider owner does not match transaction signer",
        "name": "ProviderOwnerMismatch"
      },
      {
        "code": 2122,
        "message": "ZK circuit ID is invalid",
        "name": "ZkCircuitIdInvalid"
      },
      {
        "code": 2123,
        "message": "ZK circuit is already registered: {0}",
        "name": "ZkCircuitAlreadyRegistered"
      },
      {
        "code": 2124,
        "message": "ZK circuit verifying key is invalid",
        "name": "ZkCircuitInvalid"
      },
      {
        "code": 2125,
        "message": "ZK circuit is not enabled for authentication",
        "name": "ZkAuthenticationDisabled"
      },
      {
        "code": 2126,
        "message": "ZK proof verification failed",
        "name": "ZkProofInvalid"
      },
      {
        "code": 2127,
        "message": "built-in provider metadata is immutable",
        "name": "BuiltinProviderImmutable"
      },
      {
        "code": 2128,
        "message": "custom provider ID is in a reserved namespace",
        "name": "ReservedProviderId"
      },
      {
        "code": 2129,
        "message": "static provider must contain 1..=8 keys",
        "name": "StaticKeyCountInvalid"
      },
      {
        "code": 2130,
        "message": "static provider kid must be unique and contain 1..=128 bytes",
        "name": "StaticKeyIdInvalid"
      },
      {
        "code": 2131,
        "message": "current validator set is unavailable",
        "name": "ValidatorSetUnavailable"
      },
      {
        "code": 2132,
        "message": "dynamic JWK set is invalid or exceeds protocol limits",
        "name": "DynamicJwkSetInvalid"
      },
      {
        "code": 2133,
        "message": "JWK vote has no unique highest candidate",
        "name": "JwkVoteTie"
      },
      {
        "code": 2134,
        "message": "JWK base64url member is not canonical",
        "name": "JwkThumbprintNonCanonical"
      },
      {
        "code": 2137,
        "message": "JWK candidate did not reach the validator supermajority threshold",
        "name": "JwkVoteQuorumNotReached"
      },
      {
        "code": 2138,
        "message": "JWK report version does not match provider configuration: expected {0}, got {1}",
        "name": "JwkReportVersionMismatch"
      }
    ]
  },
  {
    "metadata": {
      "app_id": 10,
      "name": "social",
      "description": "Milon social app IDL"
    },
    "instructions": [
      {
        "args": [
          {
            "name": "follower",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "target",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 1031,
        "handler": "follow",
        "kind": "entry",
        "name": "Follow"
      },
      {
        "args": [
          {
            "name": "follower",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "target",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 62356,
        "handler": "unfollow",
        "kind": "entry",
        "name": "Unfollow"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 12987,
        "handler": "create_follow_sponsor",
        "kind": "entry",
        "name": "CreateFollowSponsor",
        "returns": {
          "type": "Address"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "sponsor",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 63283,
        "handler": "close_follow_sponsor",
        "kind": "entry",
        "name": "CloseFollowSponsor",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "follower",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "target",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "sponsor",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 14127,
        "handler": "follow_sponsored",
        "kind": "entry",
        "name": "FollowSponsored",
        "sponsor": true
      },
      {
        "args": [
          {
            "name": "follower",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "target",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 49754,
        "handler": "is_following",
        "kind": "view",
        "name": "IsFollowing",
        "returns": {
          "type": "bool"
        }
      },
      {
        "args": [
          {
            "name": "target",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 17041,
        "handler": "follow_sponsor_address",
        "kind": "view",
        "name": "FollowSponsorAddress",
        "returns": {
          "type": "Address"
        }
      },
      {
        "args": [
          {
            "name": "sponsor",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 13614,
        "handler": "follow_sponsor",
        "kind": "view",
        "name": "FollowSponsor",
        "returns": {
          "type": "FollowSponsor"
        }
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "uri",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 13067,
        "handler": "upsert_social_profile",
        "kind": "entry",
        "name": "UpsertSocialProfile"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          }
        ],
        "discriminator": 23225,
        "handler": "register_source_app",
        "kind": "entry",
        "name": "RegisterSourceApp",
        "returns": {
          "type": "u32"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "source_app_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "publisher",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 55820,
        "handler": "add_source_app_publisher",
        "kind": "entry",
        "name": "AddSourceAppPublisher"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "source_app_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "publisher",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 62309,
        "handler": "remove_source_app_publisher",
        "kind": "entry",
        "name": "RemoveSourceAppPublisher"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "source_app_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "new_owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 21283,
        "handler": "transfer_source_app_owner",
        "kind": "entry",
        "name": "TransferSourceAppOwner"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "source_app_id",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 52796,
        "handler": "deactivate_source_app",
        "kind": "entry",
        "name": "DeactivateSourceApp"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "source_app_id",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 55074,
        "handler": "reactivate_source_app",
        "kind": "entry",
        "name": "ReactivateSourceApp"
      },
      {
        "args": [
          {
            "name": "publisher",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "source_app_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "object_type",
            "role": "input",
            "type": "ObjectType"
          },
          {
            "name": "object_id",
            "role": "input",
            "type": "String"
          },
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "content_hash",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "uri",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 32627,
        "handler": "upsert_reference",
        "kind": "entry",
        "name": "UpsertReference"
      },
      {
        "args": [
          {
            "name": "publisher",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "source_app_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "object_type",
            "role": "input",
            "type": "ObjectType"
          },
          {
            "name": "object_id",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 41015,
        "handler": "retire_reference",
        "kind": "entry",
        "name": "RetireReference"
      },
      {
        "args": [
          {
            "name": "creator",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "join_mode",
            "role": "input",
            "type": "JoinMode"
          },
          {
            "name": "uri",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 18868,
        "handler": "create_community",
        "kind": "entry",
        "name": "CreateCommunity",
        "returns": {
          "type": "u32"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "uri",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 63564,
        "handler": "update_community_uri",
        "kind": "entry",
        "name": "UpdateCommunityUri"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "join_mode",
            "role": "input",
            "type": "JoinMode"
          }
        ],
        "discriminator": 20649,
        "handler": "set_community_join_mode",
        "kind": "entry",
        "name": "SetCommunityJoinMode"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "new_owner",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 5543,
        "handler": "transfer_community_owner",
        "kind": "entry",
        "name": "TransferCommunityOwner"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 32318,
        "handler": "deactivate_community",
        "kind": "entry",
        "name": "DeactivateCommunity"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 12783,
        "handler": "dissolve_community",
        "kind": "entry",
        "name": "DissolveCommunity"
      },
      {
        "args": [
          {
            "name": "admin",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "member",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 15042,
        "handler": "add_community_member",
        "kind": "entry",
        "name": "AddCommunityMember"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "admin",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 10690,
        "handler": "grant_community_admin",
        "kind": "entry",
        "name": "GrantCommunityAdmin"
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "admin",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 62146,
        "handler": "revoke_community_admin",
        "kind": "entry",
        "name": "RevokeCommunityAdmin"
      },
      {
        "args": [
          {
            "name": "member",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 39196,
        "handler": "join_community",
        "kind": "entry",
        "name": "JoinCommunity"
      },
      {
        "args": [
          {
            "name": "member",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 57790,
        "handler": "request_join_community",
        "kind": "entry",
        "name": "RequestJoinCommunity"
      },
      {
        "args": [
          {
            "name": "member",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 33199,
        "handler": "cancel_join_request",
        "kind": "entry",
        "name": "CancelJoinRequest"
      },
      {
        "args": [
          {
            "name": "admin",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "member",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 2182,
        "handler": "approve_join_request",
        "kind": "entry",
        "name": "ApproveJoinRequest"
      },
      {
        "args": [
          {
            "name": "admin",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "member",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 21924,
        "handler": "reject_join_request",
        "kind": "entry",
        "name": "RejectJoinRequest"
      },
      {
        "args": [
          {
            "name": "member",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 7711,
        "handler": "leave_community",
        "kind": "entry",
        "name": "LeaveCommunity"
      },
      {
        "args": [
          {
            "name": "admin",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "member",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 7071,
        "handler": "remove_community_member",
        "kind": "entry",
        "name": "RemoveCommunityMember"
      },
      {
        "args": [
          {
            "name": "creator",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "total_amount",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "claim_count",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "allocation",
            "role": "input",
            "type": "HongbaoAllocation"
          },
          {
            "name": "expires_at_ms",
            "role": "input",
            "type": "option<u64>"
          },
          {
            "name": "message",
            "role": "input",
            "type": "option<String>"
          }
        ],
        "discriminator": 7621,
        "handler": "create_hongbao",
        "kind": "entry",
        "name": "CreateHongbao"
      },
      {
        "args": [
          {
            "name": "claimant",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "hongbao_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 40045,
        "handler": "claim_hongbao",
        "kind": "entry",
        "name": "ClaimHongbao",
        "sponsor": true
      },
      {
        "args": [
          {
            "name": "subject",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 5863,
        "handler": "social_profile",
        "kind": "view",
        "name": "SocialProfile",
        "returns": {
          "type": "String"
        }
      },
      {
        "args": [
          {
            "name": "source_app_id",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 2147,
        "handler": "source_app",
        "kind": "view",
        "name": "SourceApp",
        "returns": {
          "type": "SourceApp"
        }
      },
      {
        "args": [
          {
            "name": "source_app_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "publisher",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 14357,
        "handler": "is_source_app_publisher",
        "kind": "view",
        "name": "IsSourceAppPublisher",
        "returns": {
          "type": "bool"
        }
      },
      {
        "args": [
          {
            "name": "source_app_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "object_type",
            "role": "input",
            "type": "ObjectType"
          },
          {
            "name": "object_id",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 7408,
        "handler": "get_reference",
        "kind": "view",
        "name": "GetReference",
        "returns": {
          "type": "Reference"
        }
      },
      {
        "args": [
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 59279,
        "handler": "community",
        "kind": "view",
        "name": "Community",
        "returns": {
          "type": "CommunityControl"
        }
      },
      {
        "args": [
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 23214,
        "handler": "is_community_dissolved",
        "kind": "view",
        "name": "IsCommunityDissolved",
        "returns": {
          "type": "bool"
        }
      },
      {
        "args": [
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "admin",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 56720,
        "handler": "is_community_admin",
        "kind": "view",
        "name": "IsCommunityAdmin",
        "returns": {
          "type": "bool"
        }
      },
      {
        "args": [
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "member",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 38404,
        "handler": "join_request",
        "kind": "view",
        "name": "JoinRequest",
        "returns": {
          "type": "bool"
        }
      },
      {
        "args": [
          {
            "name": "community_id",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "member",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 36616,
        "handler": "community_membership",
        "kind": "view",
        "name": "CommunityMembership",
        "returns": {
          "type": "bool"
        }
      },
      {
        "args": [
          {
            "name": "hongbao_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "claimant",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 16618,
        "handler": "can_claim_community_hongbao",
        "kind": "view",
        "name": "CanClaimCommunityHongbao",
        "returns": {
          "type": "bool"
        }
      },
      {
        "args": [
          {
            "name": "hongbao_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 54956,
        "handler": "hongbao_community",
        "kind": "view",
        "name": "HongbaoCommunity",
        "returns": {
          "type": "u32"
        }
      }
    ],
    "types": [
      {
        "kind": "enum",
        "name": "ObjectType",
        "typeTag": "4204633598885965265",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Profile"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Tags"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Content"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Relationship"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Other"
          }
        ]
      },
      {
        "kind": "enum",
        "name": "JoinMode",
        "typeTag": "15421268599611707797",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Open"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Approval"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "owner",
            "type": "Address"
          },
          {
            "name": "publishing_enabled",
            "type": "bool"
          }
        ],
        "kind": "struct",
        "name": "SourceApp",
        "typeTag": "1060436512969659370"
      },
      {
        "kind": "enum",
        "name": "ReferenceStatus",
        "typeTag": "1498762012094692129",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Active"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Retired"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "subject",
            "type": "Address"
          },
          {
            "name": "content_hash",
            "type": "B256"
          },
          {
            "name": "uri",
            "type": "String"
          },
          {
            "name": "status",
            "type": "ReferenceStatus"
          },
          {
            "name": "revision",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "Reference",
        "typeTag": "5381990978971768279"
      },
      {
        "fields": [
          {
            "name": "owner",
            "type": "Address"
          },
          {
            "name": "join_mode",
            "type": "JoinMode"
          },
          {
            "name": "mutations_enabled",
            "type": "bool"
          },
          {
            "name": "member_count",
            "type": "u32"
          },
          {
            "name": "uri",
            "type": "String"
          }
        ],
        "kind": "struct",
        "name": "CommunityControl",
        "typeTag": "9957587179171262664"
      },
      {
        "fields": [
          {
            "name": "owner",
            "type": "Address"
          },
          {
            "name": "target",
            "type": "Address"
          },
          {
            "name": "active",
            "type": "bool"
          }
        ],
        "kind": "struct",
        "name": "FollowSponsor",
        "typeTag": "14805218812742557103"
      },
      {
        "kind": "enum",
        "name": "HongbaoAllocation",
        "typeTag": "12559390919027217581",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Equal"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Lucky"
          }
        ]
      },
      {
        "kind": "builtin",
        "name": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "kind": "builtin",
        "name": "B256",
        "typeTag": "12016729314829497160"
      },
      {
        "kind": "builtin",
        "name": "String",
        "typeTag": "8566531010829758022"
      },
      {
        "kind": "builtin",
        "name": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "kind": "builtin",
        "name": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "kind": "builtin",
        "name": "u64",
        "typeTag": "5563585020063213298"
      }
    ],
    "resources": [
      {
        "name": "_SocialProfile",
        "type": "String",
        "typeTag": "8566531010829758022"
      },
      {
        "name": "_SourceApp",
        "type": "SourceApp",
        "typeTag": "1060436512969659370"
      },
      {
        "name": "_SourcePublisher",
        "type": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "name": "_Reference",
        "type": "Reference",
        "typeTag": "5381990978971768279"
      },
      {
        "name": "_CommunityControl",
        "type": "CommunityControl",
        "typeTag": "9957587179171262664"
      },
      {
        "name": "_CommunityAdmin",
        "type": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "name": "_JoinRequest",
        "type": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "name": "_Membership",
        "type": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "name": "_SourceAppSequence",
        "type": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "name": "_CommunitySequence",
        "type": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "name": "_CommunityCreatorCount",
        "type": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "name": "_CommunityHongbao",
        "type": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "name": "_CommunityDissolved",
        "type": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "name": "_Follow",
        "type": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "name": "_FollowSponsor",
        "type": "FollowSponsor",
        "typeTag": "14805218812742557103"
      },
      {
        "name": "_SponsoredFollowUsed",
        "type": "bool",
        "typeTag": "14785269867199075517"
      }
    ],
    "constants": [
      {
        "name": "MAX_COMMUNITIES_PER_CREATOR",
        "type": "u32",
        "value": 8
      },
      {
        "name": "MAX_MEMBERS_PER_COMMUNITY",
        "type": "u32",
        "value": 10000
      }
    ],
    "errors": [
      {
        "code": 2560,
        "message": "DID does not exist or is deactivated: {0:?}",
        "name": "DidNotActive"
      },
      {
        "code": 2561,
        "message": "an active organization DID is required: {0:?}",
        "name": "OrganizationDidRequired"
      },
      {
        "code": 2562,
        "message": "community ID sequence is exhausted",
        "name": "CommunityIdExhausted"
      },
      {
        "code": 2563,
        "message": "URI is invalid",
        "name": "InvalidUri"
      },
      {
        "code": 2564,
        "message": "source app not found: {0}",
        "name": "SourceAppNotFound"
      },
      {
        "code": 2565,
        "message": "source app already exists: {0}",
        "name": "SourceAppAlreadyExists"
      },
      {
        "code": 2566,
        "message": "source app publishing is disabled: {0}",
        "name": "SourceAppPublishingDisabled"
      },
      {
        "code": 2567,
        "message": "source app owner required: {0:?}",
        "name": "SourceAppOwnerRequired"
      },
      {
        "code": 2568,
        "message": "source app publisher required: app={0}, signer={1:?}",
        "name": "SourceAppPublisherRequired"
      },
      {
        "code": 2569,
        "message": "publisher already exists: app={0}, signer={1:?}",
        "name": "PublisherAlreadyExists"
      },
      {
        "code": 2570,
        "message": "publisher not found: app={0}, signer={1:?}",
        "name": "PublisherNotFound"
      },
      {
        "code": 2571,
        "message": "a source app owner cannot be removed as its publisher",
        "name": "CannotRemoveOwnerPublisher"
      },
      {
        "code": 2572,
        "message": "source app ID sequence is exhausted",
        "name": "SourceAppIdExhausted"
      },
      {
        "code": 2573,
        "message": "stable object ID is invalid",
        "name": "InvalidObjectId"
      },
      {
        "code": 2574,
        "message": "reference not found",
        "name": "ReferenceNotFound"
      },
      {
        "code": 2575,
        "message": "reference is retired",
        "name": "ReferenceRetired"
      },
      {
        "code": 2576,
        "message": "reference is not retired",
        "name": "ReferenceNotRetired"
      },
      {
        "code": 2577,
        "message": "reference revision is exhausted",
        "name": "ReferenceRevisionExhausted"
      },
      {
        "code": 2578,
        "message": "community not found: {0}",
        "name": "CommunityNotFound"
      },
      {
        "code": 2579,
        "message": "community already exists: {0}",
        "name": "CommunityAlreadyExists"
      },
      {
        "code": 2580,
        "message": "community mutations are disabled: {0}",
        "name": "CommunityMutationsDisabled"
      },
      {
        "code": 2581,
        "message": "community owner required: {0:?}",
        "name": "CommunityOwnerRequired"
      },
      {
        "code": 2582,
        "message": "community administrator required: {0:?}",
        "name": "CommunityAdminRequired"
      },
      {
        "code": 2583,
        "message": "the community owner cannot be removed",
        "name": "CannotRemoveCommunityOwner"
      },
      {
        "code": 2584,
        "message": "community administrator already exists: {0:?}",
        "name": "CommunityAdminAlreadyExists"
      },
      {
        "code": 2585,
        "message": "community administrator not found: {0:?}",
        "name": "CommunityAdminNotFound"
      },
      {
        "code": 2586,
        "message": "join mode does not allow this operation",
        "name": "InvalidJoinMode"
      },
      {
        "code": 2587,
        "message": "membership is already active: {0:?}",
        "name": "MembershipAlreadyActive"
      },
      {
        "code": 2588,
        "message": "active membership was not found: {0:?}",
        "name": "MembershipNotActive"
      },
      {
        "code": 2589,
        "message": "a join request is already pending: {0:?}",
        "name": "JoinRequestAlreadyPending"
      },
      {
        "code": 2590,
        "message": "pending join request was not found: {0:?}",
        "name": "JoinRequestNotPending"
      },
      {
        "code": 2591,
        "message": "Transparent IdentityError",
        "name": "IdentityError",
        "transparent": true
      },
      {
        "code": 2592,
        "message": "community creation limit reached for DID: {0:?}",
        "name": "CommunityCreationLimitReached"
      },
      {
        "code": 2593,
        "message": "community member limit reached: {0}",
        "name": "CommunityMemberLimitReached"
      },
      {
        "code": 2594,
        "message": "community member count invariant failed: {0}",
        "name": "CommunityMemberCountInvariant"
      },
      {
        "code": 2595,
        "message": "Transparent TokenError",
        "name": "TokenError",
        "transparent": true
      },
      {
        "code": 2596,
        "message": "community hongbao not found: {0:?}",
        "name": "CommunityHongbaoNotFound"
      },
      {
        "code": 2597,
        "message": "the community owner cannot leave",
        "name": "CannotLeaveCommunityOwner"
      },
      {
        "code": 2598,
        "message": "community is dissolved: {0}",
        "name": "CommunityDissolved"
      },
      {
        "code": 2599,
        "message": "cannot follow yourself",
        "name": "CannotFollowSelf"
      },
      {
        "code": 2600,
        "message": "already following: {0:?}",
        "name": "AlreadyFollowing"
      },
      {
        "code": 2601,
        "message": "not following: {0:?}",
        "name": "NotFollowing"
      },
      {
        "code": 2602,
        "message": "follow sponsor funding amount must be positive",
        "name": "InvalidFollowSponsorAmount"
      },
      {
        "code": 2603,
        "message": "invalid follow sponsor address: {0:?}",
        "name": "InvalidFollowSponsor"
      },
      {
        "code": 2604,
        "message": "follow sponsor not found: {0:?}",
        "name": "FollowSponsorNotFound"
      },
      {
        "code": 2605,
        "message": "follow sponsorship has already been used for this pair",
        "name": "FollowSponsorshipAlreadyUsed"
      },
      {
        "code": 2606,
        "message": "follow sponsor owner required: {0:?}",
        "name": "FollowSponsorOwnerRequired"
      },
      {
        "code": 2607,
        "message": "follow sponsor is closed: {0:?}",
        "name": "FollowSponsorClosed"
      }
    ]
  },
  {
    "metadata": {
      "app_id": 11,
      "name": "funds",
      "description": "Milon funds app IDL"
    },
    "instructions": [
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "asset",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 31792,
        "handler": "claim_operator_reward",
        "kind": "entry",
        "name": "ClaimOperatorReward",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "app",
            "role": "input",
            "type": "u8"
          },
          {
            "name": "asset",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "total",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "policy",
            "role": "input",
            "type": "FeePolicy"
          },
          {
            "name": "promoted",
            "role": "input",
            "type": "bool"
          }
        ],
        "discriminator": 59330,
        "handler": "standard_fee_split",
        "kind": "view",
        "name": "StandardFeeSplit",
        "returns": {
          "type": "FeeSplit"
        }
      },
      {
        "args": [
          {
            "name": "epoch",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 649,
        "handler": "application_reward_budget",
        "kind": "view",
        "name": "ApplicationRewardBudget",
        "returns": {
          "type": "AppBudget"
        }
      },
      {
        "args": [
          {
            "name": "owner",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "asset",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 45647,
        "handler": "operator_reward",
        "kind": "view",
        "name": "OperatorReward",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "asset",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 48531,
        "handler": "reward_reserve",
        "kind": "view",
        "name": "RewardReserve",
        "returns": {
          "type": "u64"
        }
      }
    ],
    "types": [
      {
        "fields": [
          {
            "name": "application",
            "type": "u64"
          },
          {
            "name": "foundation",
            "type": "u64"
          },
          {
            "name": "staking",
            "type": "u64"
          },
          {
            "name": "promotion",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "FeeSplit",
        "typeTag": "5116823057170717441"
      },
      {
        "fields": [
          {
            "name": "assets",
            "type": "map<Address,u64>"
          },
          {
            "name": "closed",
            "type": "bool"
          }
        ],
        "kind": "struct",
        "name": "AppBudget",
        "typeTag": "5557752805704797021"
      },
      {
        "fields": [
          {
            "name": "foundation_bps",
            "type": "u16"
          },
          {
            "name": "staking_bps",
            "type": "u16"
          },
          {
            "name": "promotion_bps",
            "type": "u16"
          }
        ],
        "kind": "struct",
        "name": "FeePolicy",
        "typeTag": "4473674291598375997"
      },
      {
        "fields": [
          {
            "name": "protocol",
            "type": "u64"
          },
          {
            "name": "foundation",
            "type": "u64"
          },
          {
            "name": "promotion",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "SplitCarry",
        "typeTag": "7885346034409931958"
      },
      {
        "fields": [
          {
            "name": "ix_index",
            "type": "u8"
          },
          {
            "name": "fee_sequence",
            "type": "u32"
          }
        ],
        "kind": "struct",
        "name": "FeeReference",
        "typeTag": "16793876211028395616"
      },
      {
        "fields": [
          {
            "name": "gas",
            "type": "u64"
          },
          {
            "name": "gas_closed",
            "type": "bool"
          }
        ],
        "kind": "struct",
        "name": "EpochBudget",
        "typeTag": "15951919452964169208"
      },
      {
        "kind": "builtin",
        "name": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "kind": "builtin",
        "name": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "kind": "builtin",
        "name": "u16",
        "typeTag": "5558799945458185151"
      },
      {
        "kind": "builtin",
        "name": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "kind": "builtin",
        "name": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "kind": "builtin",
        "name": "u8",
        "typeTag": "631772817358541784"
      }
    ],
    "resources": [
      {
        "name": "_AppBudget",
        "type": "AppBudget",
        "typeTag": "5557752805704797021"
      },
      {
        "name": "_SplitCarry",
        "type": "SplitCarry",
        "typeTag": "7885346034409931958"
      },
      {
        "name": "_EpochBudget",
        "type": "EpochBudget",
        "typeTag": "15951919452964169208"
      },
      {
        "name": "_Claimable",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Reserve",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_GasSplitRemainder",
        "type": "u64",
        "typeTag": "5563585020063213298"
      }
    ],
    "events": [
      {
        "fields": [
          {
            "indexed": false,
            "name": "ix_index",
            "type": "u8"
          },
          {
            "indexed": false,
            "name": "fee_sequence",
            "type": "u32"
          },
          {
            "indexed": false,
            "name": "app",
            "type": "u8"
          },
          {
            "indexed": true,
            "name": "asset",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "source",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "total",
            "type": "u64"
          }
        ],
        "name": "FeeDebited",
        "typeTag": "17811253492375370012"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "tx_index",
            "type": "u32"
          },
          {
            "indexed": false,
            "name": "ix_index",
            "type": "u8"
          },
          {
            "indexed": false,
            "name": "fee_sequence",
            "type": "u32"
          },
          {
            "indexed": false,
            "name": "app",
            "type": "u8"
          },
          {
            "indexed": true,
            "name": "asset",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "total",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "application",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "foundation",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "staking",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "promotion",
            "type": "u64"
          },
          {
            "indexed": true,
            "name": "promoter",
            "type": "Address"
          }
        ],
        "name": "FeeDistributed",
        "typeTag": "1660378381402298022"
      }
    ]
  },
  {
    "metadata": {
      "app_id": 12,
      "name": "commission",
      "description": "Milon commission app IDL"
    },
    "instructions": [
      {
        "args": [
          {
            "name": "owner",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "rules",
            "role": "input",
            "type": "CollectionRules"
          }
        ],
        "discriminator": 44293,
        "handler": "create_collection",
        "kind": "entry",
        "name": "CreateCollection"
      },
      {
        "args": [
          {
            "name": "owner_signer",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "scheme_id",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 29185,
        "handler": "stop_collection",
        "kind": "entry",
        "name": "StopCollection"
      },
      {
        "args": [
          {
            "name": "owner_signer",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "scheme_id",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 1711,
        "handler": "destroy_collection",
        "kind": "entry",
        "name": "DestroyCollection"
      },
      {
        "args": [
          {
            "name": "payer",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "collection_address",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "order_key",
            "role": "input",
            "type": "B96"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 2795,
        "handler": "pay_collection",
        "kind": "entry",
        "name": "PayCollection"
      },
      {
        "args": [
          {
            "name": "order_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "gas_address",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "step",
            "role": "input",
            "type": "u8"
          }
        ],
        "discriminator": 5194,
        "handler": "run_collection_task",
        "kind": "entry",
        "name": "RunCollectionTask",
        "sponsor": true
      },
      {
        "args": [
          {
            "name": "authority",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "order_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "refund_key",
            "role": "input",
            "type": "B256"
          },
          {
            "name": "target_refunded",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 63257,
        "handler": "refund_order",
        "kind": "entry",
        "name": "RefundOrder"
      },
      {
        "args": [
          {
            "name": "order_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 44200,
        "handler": "settle_order",
        "kind": "entry",
        "name": "SettleOrder"
      },
      {
        "args": [
          {
            "name": "order_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 4649,
        "handler": "claim_merchant",
        "kind": "entry",
        "name": "ClaimMerchant"
      },
      {
        "args": [
          {
            "name": "order_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 30103,
        "handler": "claim_promoter",
        "kind": "entry",
        "name": "ClaimPromoter"
      },
      {
        "args": [
          {
            "name": "scheme_id",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 37758,
        "handler": "collection_scheme",
        "kind": "view",
        "name": "CollectionScheme",
        "returns": {
          "type": "option<CollectionScheme>"
        }
      },
      {
        "args": [
          {
            "name": "collection_address",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "order_key",
            "role": "input",
            "type": "B96"
          }
        ],
        "discriminator": 28641,
        "handler": "collection_order_id",
        "kind": "view",
        "name": "CollectionOrderId",
        "returns": {
          "type": "Address"
        }
      },
      {
        "args": [
          {
            "name": "order_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 28347,
        "handler": "collection_order",
        "kind": "view",
        "name": "CollectionOrder",
        "returns": {
          "type": "option<CollectionOrder>"
        }
      },
      {
        "args": [
          {
            "name": "order_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 60520,
        "handler": "order",
        "kind": "view",
        "name": "Order",
        "returns": {
          "type": "option<OrderState>"
        }
      },
      {
        "args": [
          {
            "name": "source",
            "role": "input",
            "type": "OrderSource"
          },
          {
            "name": "order_key",
            "role": "input",
            "type": "B96"
          }
        ],
        "discriminator": 5488,
        "handler": "order_id",
        "kind": "view",
        "name": "OrderId",
        "returns": {
          "type": "Address"
        }
      },
      {
        "args": [
          {
            "name": "order_id",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "refund_key",
            "role": "input",
            "type": "B256"
          }
        ],
        "discriminator": 38617,
        "handler": "refund_receipt",
        "kind": "view",
        "name": "RefundReceipt",
        "returns": {
          "type": "option<RefundReceipt>"
        }
      },
      {
        "args": [
          {
            "name": "order_id",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 53290,
        "handler": "order_overview",
        "kind": "view",
        "name": "OrderOverview",
        "returns": {
          "type": "option<OrderOverview>"
        }
      },
      {
        "args": [
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "bps",
            "role": "input",
            "type": "u16"
          }
        ],
        "discriminator": 57364,
        "handler": "quote_commission",
        "kind": "view",
        "name": "QuoteCommission",
        "returns": {
          "type": "u64"
        }
      }
    ],
    "types": [
      {
        "fields": [
          {
            "name": "asset",
            "type": "Address"
          },
          {
            "name": "merchant_recipient",
            "type": "Address"
          },
          {
            "name": "promoter",
            "type": "option<Address>"
          },
          {
            "name": "commission_bps",
            "type": "u16"
          },
          {
            "name": "refund_mode",
            "type": "u8"
          },
          {
            "name": "refund_window_ms",
            "type": "u64"
          },
          {
            "name": "settlement_delay_ms",
            "type": "u64"
          },
          {
            "name": "refund_authority",
            "type": "Address"
          },
          {
            "name": "max_order_validity_secs",
            "type": "u32"
          },
          {
            "name": "min_amount",
            "type": "u64"
          },
          {
            "name": "fixed_amount",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "CollectionRules",
        "typeTag": "15488354332635492500"
      },
      {
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "Address"
          },
          {
            "name": "collection_address",
            "type": "Address"
          },
          {
            "name": "gas_address",
            "type": "Address"
          },
          {
            "name": "stopped",
            "type": "bool"
          },
          {
            "name": "outstanding_orders",
            "type": "u64"
          },
          {
            "name": "reserved_gas",
            "type": "u64"
          },
          {
            "name": "rules",
            "type": "CollectionRules"
          }
        ],
        "kind": "struct",
        "name": "CollectionScheme",
        "typeTag": "3192223671778686206"
      },
      {
        "fields": [
          {
            "name": "scheme_id",
            "type": "u64"
          },
          {
            "name": "reserved_gas",
            "type": "u64"
          },
          {
            "name": "refund_keys",
            "type": "vec<B256>"
          }
        ],
        "kind": "struct",
        "name": "CollectionOrder",
        "typeTag": "6886062861590659611"
      },
      {
        "fields": [
          {
            "name": "order_id",
            "type": "Address"
          },
          {
            "name": "gas_address",
            "type": "Address"
          },
          {
            "name": "due_timestamp_ms",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "CollectionTask",
        "typeTag": "10242133544504197548"
      },
      {
        "fields": [
          {
            "name": "order_key",
            "type": "B96"
          },
          {
            "name": "asset",
            "type": "Address"
          },
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "merchant_recipient",
            "type": "Address"
          },
          {
            "name": "promoter",
            "type": "option<Address>"
          },
          {
            "name": "commission_bps",
            "type": "u16"
          },
          {
            "name": "refund_mode",
            "type": "u8"
          },
          {
            "name": "refund_window_ms",
            "type": "u64"
          },
          {
            "name": "refund_authority",
            "type": "Address"
          },
          {
            "name": "pay_before_ms",
            "type": "u64"
          },
          {
            "name": "terms_hash",
            "type": "option<B256>"
          }
        ],
        "kind": "struct",
        "name": "PaymentTerms",
        "typeTag": "17565249257074929795"
      },
      {
        "fields": [
          {
            "name": "app",
            "type": "option<u8>"
          },
          {
            "name": "owner",
            "type": "Address"
          }
        ],
        "kind": "struct",
        "name": "OrderSource",
        "typeTag": "348271013082722207"
      },
      {
        "fields": [
          {
            "name": "source",
            "type": "OrderSource"
          },
          {
            "name": "payer",
            "type": "Address"
          },
          {
            "name": "terms",
            "type": "PaymentTerms"
          },
          {
            "name": "paid_at_ms",
            "type": "u64"
          },
          {
            "name": "refund_deadline_ms",
            "type": "u64"
          },
          {
            "name": "settle_at_ms",
            "type": "option<u64>"
          },
          {
            "name": "refunded",
            "type": "u64"
          },
          {
            "name": "remaining",
            "type": "u64"
          },
          {
            "name": "settled",
            "type": "bool"
          },
          {
            "name": "merchant_amount",
            "type": "u64"
          },
          {
            "name": "commission_amount",
            "type": "u64"
          },
          {
            "name": "merchant_claimed",
            "type": "bool"
          },
          {
            "name": "promoter_claimed",
            "type": "bool"
          },
          {
            "name": "busy",
            "type": "bool"
          }
        ],
        "kind": "struct",
        "name": "OrderState",
        "typeTag": "13764258922507694983"
      },
      {
        "fields": [
          {
            "name": "target",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "RefundReceipt",
        "typeTag": "1471384252932959876"
      },
      {
        "kind": "enum",
        "name": "OrderStatus",
        "typeTag": "2798372844217287980",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "Holding"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "ReadyToSettle"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "AwaitingClaims"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Refunded"
          },
          {
            "fields": [],
            "kind": "unit",
            "name": "Closed"
          }
        ]
      },
      {
        "fields": [
          {
            "name": "order_id",
            "type": "Address"
          },
          {
            "name": "asset",
            "type": "Address"
          },
          {
            "name": "as_of_ms",
            "type": "u64"
          },
          {
            "name": "status",
            "type": "OrderStatus"
          },
          {
            "name": "refund_deadline_ms",
            "type": "u64"
          },
          {
            "name": "settle_at_ms",
            "type": "option<u64>"
          },
          {
            "name": "paid_amount",
            "type": "u64"
          },
          {
            "name": "refunded_amount",
            "type": "u64"
          },
          {
            "name": "remaining_principal",
            "type": "u64"
          },
          {
            "name": "net_amount",
            "type": "u64"
          },
          {
            "name": "merchant_amount",
            "type": "u64"
          },
          {
            "name": "commission_amount",
            "type": "u64"
          },
          {
            "name": "merchant_claimable",
            "type": "u64"
          },
          {
            "name": "promoter_claimable",
            "type": "u64"
          },
          {
            "name": "refundable_amount",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "OrderOverview",
        "typeTag": "7320224591769319329"
      },
      {
        "kind": "builtin",
        "name": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "kind": "builtin",
        "name": "B256",
        "typeTag": "12016729314829497160"
      },
      {
        "kind": "builtin",
        "name": "B96",
        "typeTag": "10733962083880633390"
      },
      {
        "kind": "builtin",
        "name": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "kind": "builtin",
        "name": "u16",
        "typeTag": "5558799945458185151"
      },
      {
        "kind": "builtin",
        "name": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "kind": "builtin",
        "name": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "kind": "builtin",
        "name": "u8",
        "typeTag": "631772817358541784"
      }
    ],
    "resources": [
      {
        "name": "_NextCollectionId",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_CollectionScheme",
        "type": "CollectionScheme",
        "typeTag": "3192223671778686206"
      },
      {
        "name": "_CollectionAddress",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_CollectionOrder",
        "type": "CollectionOrder",
        "typeTag": "6886062861590659611"
      },
      {
        "name": "_CollectionTaskShard",
        "type": "vec<CollectionTask>",
        "typeTag": "18104485592292335375"
      },
      {
        "name": "_CollectionShardHead",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Order",
        "type": "OrderState",
        "typeTag": "13764258922507694983"
      },
      {
        "name": "_RefundReceipt",
        "type": "RefundReceipt",
        "typeTag": "1471384252932959876"
      }
    ],
    "constants": [
      {
        "name": "MAX_ORDER_VALIDITY_SECS",
        "type": "u32",
        "value": 86400
      },
      {
        "name": "MAX_COLLECTION_ORDERS",
        "type": "u64",
        "value": 1024
      },
      {
        "name": "MAX_ORDER_REFUNDS",
        "type": "usize",
        "value": 32
      },
      {
        "name": "COLLECTION_STEP_BUDGET",
        "type": "u64",
        "value": 1000000
      },
      {
        "name": "COLLECTION_ORDER_BUDGET",
        "type": "u64",
        "value": "2 * COLLECTION_STEP_BUDGET"
      },
      {
        "name": "COLLECTION_QUEUE_SHARDS",
        "type": "u8",
        "value": 32
      },
      {
        "name": "COLLECTION_TASKS_PER_SHARD",
        "type": "usize",
        "value": 128
      },
      {
        "name": "MAX_REFUND_WINDOW_MS",
        "type": "u64",
        "value": "366 * 24 * 60 * 60 * 1000"
      }
    ],
    "events": [
      {
        "fields": [
          {
            "indexed": true,
            "name": "scheme_id",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "owner",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "collection_address",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "gas_address",
            "type": "Address"
          }
        ],
        "name": "CollectionCreated",
        "typeTag": "17165750801407412428"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "scheme_id",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "order_key",
            "type": "B96"
          },
          {
            "indexed": false,
            "name": "order_id",
            "type": "Address"
          }
        ],
        "name": "CollectionPaid",
        "typeTag": "18232308749046114522"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "scheme_id",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "returned_gas",
            "type": "u64"
          }
        ],
        "name": "CollectionDestroyed",
        "typeTag": "4521787113928327719"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "order_id",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "payer",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "merchant",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "asset",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "promoter",
            "type": "option<Address>"
          },
          {
            "indexed": false,
            "name": "commission_bps",
            "type": "u16"
          },
          {
            "indexed": false,
            "name": "refund_deadline_ms",
            "type": "u64"
          }
        ],
        "name": "OrderPaid",
        "typeTag": "9085254848095096670"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "order_id",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "refund_key",
            "type": "B256"
          },
          {
            "indexed": false,
            "name": "payer",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "asset",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "refunded",
            "type": "u64"
          }
        ],
        "name": "OrderRefunded",
        "typeTag": "3541440975636163443"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "order_id",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "asset",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "merchant_amount",
            "type": "u64"
          },
          {
            "indexed": false,
            "name": "commission_amount",
            "type": "u64"
          }
        ],
        "name": "OrderSettled",
        "typeTag": "4310159538867681105"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "order_id",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "recipient",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "asset",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          }
        ],
        "name": "MerchantClaimed",
        "typeTag": "9365702435352109885"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "order_id",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "recipient",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "asset",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          }
        ],
        "name": "CommissionClaimed",
        "typeTag": "2987876547204411306"
      }
    ],
    "errors": [
      {
        "code": 3072,
        "message": "Transparent Token",
        "name": "Token",
        "transparent": true
      },
      {
        "code": 3073,
        "message": "order not found",
        "name": "NotFound"
      },
      {
        "code": 3074,
        "message": "order already paid",
        "name": "AlreadyPaid"
      },
      {
        "code": 3075,
        "message": "order operation in progress",
        "name": "Busy"
      },
      {
        "code": 3076,
        "message": "refund is not authorized",
        "name": "UnauthorizedRefund"
      },
      {
        "code": 3077,
        "message": "refund window has closed",
        "name": "RefundClosed"
      },
      {
        "code": 3078,
        "message": "order is not ready to settle",
        "name": "NotDue"
      },
      {
        "code": 3079,
        "message": "refund request conflicts with its previous result",
        "name": "RefundConflict"
      },
      {
        "code": 3080,
        "message": "refund target must increase and not exceed payment",
        "name": "InvalidRefundTarget"
      },
      {
        "code": 3081,
        "message": "order custody invariant violated",
        "name": "CustodyInvariant"
      },
      {
        "code": 3082,
        "message": "wrong creating application",
        "name": "WrongApplication"
      },
      {
        "code": 3083,
        "message": "payment amount must be positive",
        "name": "InvalidAmount"
      },
      {
        "code": 3084,
        "message": "payment asset must not be null",
        "name": "InvalidAsset"
      },
      {
        "code": 3085,
        "message": "order source owner must not be null",
        "name": "InvalidSource"
      },
      {
        "code": 3086,
        "message": "recipient must be non-null and different from order custody",
        "name": "InvalidRecipient"
      },
      {
        "code": 3087,
        "message": "commission must be within 0..=10000 bps and zero without a promoter",
        "name": "InvalidCommission"
      },
      {
        "code": 3088,
        "message": "refund mode must be 0, 1 or 2",
        "name": "InvalidRefundMode"
      },
      {
        "code": 3089,
        "message": "refund window is invalid or its deadline overflows",
        "name": "InvalidRefundWindow"
      },
      {
        "code": 3090,
        "message": "refund authority does not match the order source",
        "name": "InvalidRefundAuthority"
      },
      {
        "code": 3091,
        "message": "payment deadline has been reached",
        "name": "PaymentExpired"
      },
      {
        "code": 3092,
        "message": "collection scheme not found",
        "name": "SchemeNotFound"
      },
      {
        "code": 3093,
        "message": "invalid immutable collection rules",
        "name": "InvalidScheme"
      },
      {
        "code": 3094,
        "message": "scheme has stopped accepting payments",
        "name": "SchemeStopped"
      },
      {
        "code": 3095,
        "message": "scheme owner authorization required",
        "name": "SchemeUnauthorized"
      },
      {
        "code": 3096,
        "message": "scheme still has outstanding orders",
        "name": "SchemeOutstanding"
      },
      {
        "code": 3097,
        "message": "scheme id exhausted",
        "name": "SchemeIdExhausted"
      },
      {
        "code": 3098,
        "message": "collection gas reserve is insufficient",
        "name": "InsufficientSettlementGas"
      },
      {
        "code": 3099,
        "message": "order deadline is too far in the future",
        "name": "InvalidOrderDeadline"
      },
      {
        "code": 3100,
        "message": "scheduled collection task rejected",
        "name": "CollectionTaskRejected"
      },
      {
        "code": 3101,
        "message": "too many outstanding orders or refund receipts",
        "name": "CollectionCapacity"
      }
    ]
  },
  {
    "metadata": {
      "app_id": 254,
      "name": "demo",
      "description": "Milon demo app IDL"
    },
    "instructions": [
      {
        "args": [
          {
            "name": "pool",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "account",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "score",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 9531,
        "handler": "set_score",
        "kind": "entry",
        "name": "SetScore",
        "signer_lookups": {
          "admin": {
            "path": {
              "arg": "pool",
              "type": "Address"
            },
            "res": 237
          }
        }
      },
      {
        "args": [
          {
            "name": "operator",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "order_id",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 47185,
        "handler": "open_order",
        "kind": "entry",
        "name": "OpenOrder"
      },
      {
        "args": [
          {
            "name": "operator",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "order_id",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 33284,
        "handler": "reject_order_inbound",
        "kind": "entry",
        "name": "RejectOrderInbound"
      },
      {
        "args": [
          {
            "name": "operator",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "order_id",
            "role": "input",
            "type": "String"
          },
          {
            "name": "forward_seed",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 12070,
        "handler": "forward_order_inbound",
        "kind": "entry",
        "name": "ForwardOrderInbound"
      },
      {
        "args": [
          {
            "name": "operator",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "order_id",
            "role": "input",
            "type": "String"
          },
          {
            "name": "first",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "second",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "first_bps",
            "role": "input",
            "type": "u16"
          }
        ],
        "discriminator": 2755,
        "handler": "split_order_inbound",
        "kind": "entry",
        "name": "SplitOrderInbound"
      },
      {
        "args": [
          {
            "name": "payer",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "order_id",
            "role": "input",
            "type": "String"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 49571,
        "handler": "pay_order",
        "kind": "entry",
        "name": "PayOrder"
      },
      {
        "args": [
          {
            "name": "operator",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "order_id",
            "role": "input",
            "type": "String"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "to",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 62622,
        "handler": "settle_order",
        "kind": "entry",
        "name": "SettleOrder"
      },
      {
        "args": [
          {
            "name": "pool",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "label",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 51459,
        "handler": "init_pool",
        "kind": "entry",
        "name": "InitPool"
      },
      {
        "args": [
          {
            "name": "dex",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "label",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 50094,
        "handler": "init_dex",
        "kind": "entry",
        "name": "InitDex"
      },
      {
        "args": [
          {
            "name": "pool",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "label",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 47391,
        "handler": "set_label",
        "kind": "entry",
        "name": "SetLabel",
        "signer_lookups": {
          "admin": {
            "path": {
              "arg": "pool",
              "type": "Address"
            },
            "res": 237
          }
        }
      },
      {
        "args": [
          {
            "name": "pool",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "recipients",
            "role": "input",
            "type": "vec<Address>"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 60858,
        "handler": "batch_credit",
        "kind": "entry",
        "name": "BatchCredit",
        "signer_lookups": {
          "admin": {
            "path": {
              "arg": "pool",
              "type": "Address"
            },
            "res": 237
          }
        }
      },
      {
        "args": [
          {
            "name": "pool",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "tier",
            "role": "input",
            "type": "u32"
          },
          {
            "name": "cap",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 55600,
        "handler": "set_tier_cap",
        "kind": "entry",
        "name": "SetTierCap",
        "signer_lookups": {
          "admin": {
            "path": {
              "arg": "pool",
              "type": "Address"
            },
            "res": 237
          }
        }
      },
      {
        "args": [
          {
            "name": "caller",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "tag",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 1414,
        "handler": "draw_u64",
        "kind": "entry",
        "name": "DrawU64",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "caller",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "tag",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 52945,
        "handler": "draw_bytes32",
        "kind": "entry",
        "name": "DrawBytes32",
        "returns": {
          "type": "B256"
        }
      },
      {
        "args": [
          {
            "name": "caller",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "tag",
            "role": "input",
            "type": "String"
          },
          {
            "name": "lo",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "hi",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 31302,
        "handler": "draw_range",
        "kind": "entry",
        "name": "DrawRange",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "pool",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 49440,
        "handler": "open_gas_sponsor_pool",
        "kind": "entry",
        "name": "OpenGasSponsorPool",
        "returns": {
          "type": "u64"
        },
        "signer_lookups": {
          "admin": {
            "path": {
              "arg": "pool",
              "type": "Address"
            },
            "res": 237
          }
        }
      },
      {
        "args": [
          {
            "name": "claimer",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "pool",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "sponsor_seed",
            "role": "input",
            "type": "u64"
          },
          {
            "name": "amount",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 1595,
        "handler": "claim_sponsored_score",
        "kind": "entry",
        "name": "ClaimSponsoredScore",
        "sponsor": true
      },
      {
        "args": [
          {
            "name": "caller",
            "role": "signer",
            "type": "Signer"
          },
          {
            "name": "due_ms",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 8376,
        "handler": "schedule_wake",
        "kind": "entry",
        "name": "ScheduleWake"
      },
      {
        "args": [],
        "discriminator": 9624,
        "handler": "run_scheduled_wake",
        "kind": "entry",
        "name": "RunScheduledWake"
      },
      {
        "args": [
          {
            "name": "pool",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "tier",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 30615,
        "handler": "tier_cap_detail",
        "kind": "view",
        "name": "TierCapDetail",
        "returns": {
          "type": "TierCap"
        }
      },
      {
        "args": [
          {
            "name": "pool",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 54498,
        "handler": "label_changes_of",
        "kind": "view",
        "name": "LabelChangesOf",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "order_id",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 9625,
        "handler": "order_vault",
        "kind": "view",
        "name": "OrderVault",
        "returns": {
          "type": "Address"
        }
      },
      {
        "args": [
          {
            "name": "order_id",
            "role": "input",
            "type": "String"
          }
        ],
        "discriminator": 56285,
        "handler": "order_last_inbound",
        "kind": "view",
        "name": "OrderLastInbound",
        "returns": {
          "type": "LastInbound"
        }
      },
      {
        "args": [
          {
            "name": "order_id",
            "role": "input",
            "type": "String"
          },
          {
            "name": "token",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 23229,
        "handler": "order_balance",
        "kind": "view",
        "name": "OrderBalance",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "pool",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 36952,
        "handler": "label_of",
        "kind": "view",
        "name": "LabelOf",
        "returns": {
          "type": "Label"
        }
      },
      {
        "args": [
          {
            "name": "pool",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "account",
            "role": "input",
            "type": "Address"
          }
        ],
        "discriminator": 24200,
        "handler": "score_of",
        "kind": "view",
        "name": "ScoreOf",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "pool",
            "role": "input",
            "type": "Address"
          },
          {
            "name": "tier",
            "role": "input",
            "type": "u32"
          }
        ],
        "discriminator": 63079,
        "handler": "tier_cap_of",
        "kind": "view",
        "name": "TierCapOf",
        "returns": {
          "type": "u64"
        }
      },
      {
        "args": [
          {
            "name": "mode",
            "role": "input",
            "type": "DemoMode"
          }
        ],
        "discriminator": 48471,
        "handler": "echo_mode",
        "kind": "view",
        "name": "EchoMode",
        "returns": {
          "type": "DemoMode"
        }
      },
      {
        "args": [
          {
            "name": "labels",
            "role": "input",
            "type": "map<String,u32>"
          }
        ],
        "discriminator": 9869,
        "handler": "label_total",
        "kind": "view",
        "name": "LabelTotal",
        "returns": {
          "type": "u32"
        }
      },
      {
        "args": [
          {
            "name": "mode",
            "role": "input",
            "type": "DemoMode"
          },
          {
            "name": "maybe_note",
            "role": "input",
            "type": "option<String>"
          },
          {
            "name": "tags",
            "role": "input",
            "type": "vec<String>"
          },
          {
            "name": "labels",
            "role": "input",
            "type": "map<String,u32>"
          },
          {
            "name": "pair",
            "role": "input",
            "type": "tuple<u8,i16>"
          }
        ],
        "discriminator": 37219,
        "handler": "special_types",
        "kind": "view",
        "name": "SpecialTypes",
        "returns": {
          "type": "u32"
        }
      },
      {
        "args": [
          {
            "name": "sponsor_seed",
            "role": "input",
            "type": "u64"
          }
        ],
        "discriminator": 38217,
        "handler": "sponsor_pool_of",
        "kind": "view",
        "name": "SponsorPoolOf",
        "returns": {
          "type": "Address"
        }
      },
      {
        "args": [],
        "discriminator": 45310,
        "handler": "scheduled_wake_count",
        "kind": "view",
        "name": "ScheduledWakeCount",
        "returns": {
          "type": "u64"
        }
      }
    ],
    "types": [
      {
        "fields": [
          {
            "name": "cap",
            "type": "u64"
          },
          {
            "name": "set_by",
            "type": "Address"
          }
        ],
        "kind": "struct",
        "name": "TierCap",
        "typeTag": "3534747969634751777"
      },
      {
        "fields": [
          {
            "name": "seed",
            "type": "u64"
          },
          {
            "name": "operator",
            "type": "Address"
          },
          {
            "name": "reject_inbound",
            "type": "bool"
          },
          {
            "name": "forward_seed",
            "type": "u64"
          },
          {
            "name": "split_bps",
            "type": "u16"
          },
          {
            "name": "split_first",
            "type": "Address"
          },
          {
            "name": "split_second",
            "type": "Address"
          }
        ],
        "kind": "struct",
        "name": "OrderState",
        "typeTag": "6116235401568728262"
      },
      {
        "fields": [
          {
            "name": "token",
            "type": "Address"
          },
          {
            "name": "from",
            "type": "Address"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ],
        "kind": "struct",
        "name": "LastInbound",
        "typeTag": "15707610513562194952"
      },
      {
        "fields": [
          {
            "name": "text",
            "type": "String"
          }
        ],
        "kind": "struct",
        "name": "Label",
        "typeTag": "17171651226162355183"
      },
      {
        "kind": "enum",
        "name": "DemoMode",
        "typeTag": "5404942628480427284",
        "variants": [
          {
            "fields": [],
            "kind": "unit",
            "name": "One"
          },
          {
            "fields": [
              {
                "name": "val",
                "type": "u32"
              }
            ],
            "kind": "struct",
            "name": "Two"
          },
          {
            "fields": [
              {
                "name": "0",
                "type": "u8"
              },
              {
                "name": "1",
                "type": "i16"
              }
            ],
            "kind": "tuple",
            "name": "Three"
          }
        ]
      },
      {
        "kind": "builtin",
        "name": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "kind": "builtin",
        "name": "B256",
        "typeTag": "12016729314829497160"
      },
      {
        "kind": "builtin",
        "name": "String",
        "typeTag": "8566531010829758022"
      },
      {
        "kind": "builtin",
        "name": "bool",
        "typeTag": "14785269867199075517"
      },
      {
        "kind": "builtin",
        "name": "i16",
        "typeTag": "3092775683940386555"
      },
      {
        "kind": "builtin",
        "name": "u16",
        "typeTag": "5558799945458185151"
      },
      {
        "kind": "builtin",
        "name": "u32",
        "typeTag": "5560783464435099345"
      },
      {
        "kind": "builtin",
        "name": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "kind": "builtin",
        "name": "u8",
        "typeTag": "631772817358541784"
      }
    ],
    "resources": [
      {
        "name": "_TierCapV2",
        "type": "TierCap",
        "typeTag": "3534747969634751777"
      },
      {
        "name": "_LabelChanges",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Order",
        "type": "OrderState",
        "typeTag": "6116235401568728262"
      },
      {
        "name": "_OrderSeed",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_LastInbound",
        "type": "LastInbound",
        "typeTag": "15707610513562194952"
      },
      {
        "name": "_NextOrderSeed",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_Admin",
        "type": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "name": "_Label",
        "type": "Label",
        "typeTag": "17171651226162355183"
      },
      {
        "name": "_Score",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_TierCap",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_NextSponsorSeed",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_SponsorPool",
        "type": "Address",
        "typeTag": "17438174819379414968"
      },
      {
        "name": "_PoolSponsor",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_WakeWork",
        "type": "u64",
        "typeTag": "5563585020063213298"
      },
      {
        "name": "_WakeFired",
        "type": "u64",
        "typeTag": "5563585020063213298"
      }
    ],
    "constants": [
      {
        "name": "WAKE_SPONSOR_SEED",
        "type": "u64",
        "value": 65000
      }
    ],
    "events": [
      {
        "fields": [
          {
            "indexed": true,
            "name": "pool",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "board",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "text",
            "type": "String"
          }
        ],
        "name": "LabelChanged",
        "typeTag": "9371027370753667669"
      },
      {
        "fields": [
          {
            "indexed": true,
            "name": "pool",
            "type": "Address"
          },
          {
            "indexed": true,
            "name": "recipient",
            "type": "Address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "u64"
          }
        ],
        "name": "EventCreditApplied",
        "typeTag": "14232600292727055113"
      }
    ],
    "errors": [
      {
        "code": 65024,
        "message": "Demo pool {0:?} not found",
        "name": "PoolNotFound"
      },
      {
        "code": 65025,
        "message": "Demo pool {0:?} already exists",
        "name": "PoolAlreadyExists"
      },
      {
        "code": 65026,
        "message": "Demo pool {0:?} recipient {1:?} not found",
        "name": "RecipientNotFound"
      },
      {
        "code": 65027,
        "message": "Invalid parameters: {0}",
        "name": "InvalidParameters"
      },
      {
        "code": 65028,
        "message": "Demo order not found: {0}",
        "name": "OrderNotFound"
      },
      {
        "code": 65029,
        "message": "Demo order already exists: {0}",
        "name": "OrderAlreadyExists"
      },
      {
        "code": 65030,
        "message": "Demo order operator mismatch: {0}",
        "name": "OrderOperatorMismatch"
      },
      {
        "code": 65031,
        "message": "Demo gas sponsor pool not found: seed {0}",
        "name": "SponsorPoolNotFound"
      },
      {
        "code": 65032,
        "message": "Demo order {0} rejected the inbound transfer",
        "name": "InboundRejected"
      },
      {
        "code": 65033,
        "message": "Demo scheduled wake rejected",
        "name": "WakeRejected"
      },
      {
        "code": 65034,
        "message": "Demo randomness unavailable: {0}",
        "name": "RandomnessUnavailable"
      }
    ]
  }
] as const;
