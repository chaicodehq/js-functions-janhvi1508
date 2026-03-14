/**
 * 🗳️ Panchayat Election System - Capstone
 *
 * Village ki panchayat election ka system bana! Yeh CAPSTONE challenge hai
 * jisme saare function concepts ek saath use honge:
 * closures, callbacks, HOF, factory, recursion, pure functions.
 *
 * Functions:
 *
 *   1. createElection(candidates)
 *      - CLOSURE: private state (votes object, registered voters set)
 *      - candidates: array of { id, name, party }
 *      - Returns object with methods:
 *
 *      registerVoter(voter)
 *        - voter: { id, name, age }
 *        - Add to private registered set. Return true.
 *        - Agar already registered or voter invalid, return false.
 *        - Agar age < 18, return false.
 *
 *      castVote(voterId, candidateId, onSuccess, onError)
 *        - CALLBACKS: call onSuccess or onError based on result
 *        - Validate: voter registered? candidate exists? already voted?
 *        - If valid: record vote, call onSuccess({ voterId, candidateId })
 *        - If invalid: call onError("reason string")
 *        - Return the callback's return value
 *
 *      getResults(sortFn)
 *        - HOF: takes optional sort comparator function
 *        - Returns array of { id, name, party, votes: count }
 *        - If sortFn provided, sort results using it
 *        - Default (no sortFn): sort by votes descending
 *
 *      getWinner()
 *        - Returns candidate object with most votes
 *        - If tie, return first candidate among tied ones
 *        - If no votes cast, return null
 *
 *   2. createVoteValidator(rules)
 *      - FACTORY: returns a validation function
 *      - rules: { minAge: 18, requiredFields: ["id", "name", "age"] }
 *      - Returned function takes a voter object and returns { valid, reason }
 *
 *   3. countVotesInRegions(regionTree)
 *      - RECURSION: count total votes in nested region structure
 *      - regionTree: { name, votes: number, subRegions: [...] }
 *      - Sum votes from this region + all subRegions (recursively)
 *      - Agar regionTree null/invalid, return 0
 *
 *   4. tallyPure(currentTally, candidateId)
 *      - PURE FUNCTION: returns NEW tally object with incremented count
 *      - currentTally: { "cand1": 5, "cand2": 3, ... }
 *      - Return new object where candidateId count is incremented by 1
 *      - MUST NOT modify currentTally
 *      - If candidateId not in tally, add it with count 1
 *
 * @example
 *   const election = createElection([
 *     { id: "C1", name: "Sarpanch Ram", party: "Janata" },
 *     { id: "C2", name: "Pradhan Sita", party: "Lok" }
 *   ]);
 *   election.registerVoter({ id: "V1", name: "Mohan", age: 25 });
 *   election.castVote("V1", "C1", r => "voted!", e => "error: " + e);
 *   // => "voted!"
 */
export function createElection(candidates) {
  let registeredVoters = {};
  let hasVoted = {};
  let voteCounts = {};
  let candidateData = {};

  for (let i = 0; i < candidates.length; i++) {
    let cand = candidates[i];
    candidateData[cand.id] = cand;
    voteCounts[cand.id] = 0;
  }
  return {
    registerVoter: function (voter) {
      if (!voter || !voter.id || !voter.age) return false;
      if (voter.age < 18) return false;
      if (registeredVoters[voter.id]) return false;

      registeredVoters[voter.id] = voter;
      return true;
    },
    castVote: function (voterId, candidateId, onSuccess, onError) {
      if (!registeredVoters[voterId]) {
        return onError("Voter is not registered");
      }
      if (hasVoted[voterId]) {
        return onError("Voter has already voted");
      }
      if (!candidateData[candidateId]) {
        return onError("Candidate does not exist");
      }
      hasVoted[voterId] = true;
      voteCounts[candidateId] = voteCounts[candidateId] + 1;
      return onSuccess({ voterId: voterId, candidateId: candidateId });
    },
    getResults: function (sortFn) {
      let results = [];
      for (let i = 0; i < candidates.length; i++) {
        let cand = candidates[i];
        results.push({
          id: cand.id,
          name: cand.name,
          party: cand.party,
          votes: voteCounts[cand.id],
        });
      }
      if (typeof sortFn === "function") {
        results.sort(sortFn);
      } else {
        results.sort(function (a, b) {
          return b.votes - a.votes;
        });
      }
      return results;
    },
    getWinner: function () {
      let maxVotes = 0;
      let winner = null;
      let totalVotesCast = 0;
      for (let i = 0; i < candidates.length; i++) {
        let cand = candidates[i];
        let votes = voteCounts[cand.id];
        totalVotesCast = totalVotesCast + votes;
        if (winner === null || votes > maxVotes) {
          maxVotes = votes;
          winner = cand;
        }
      }
      if (totalVotesCast === 0) {
        return null;
      }
      return winner;
    },
  };
}

export function createVoteValidator(rules) {
  return function (voter) {
    if (!voter) {
      return { valid: false, reason: "No voter provided" };
    }
    if (rules.requiredFields) {
      for (let i = 0; i < rules.requiredFields.length; i++) {
        let fieldName = rules.requiredFields[i];
        if (voter[fieldName] === undefined) {
          return { valid: false, reason: "Missing field: " + fieldName };
        }
      }
    }
    if (rules.minAge !== undefined) {
      if (voter.age < rules.minAge) {
        return { valid: false, reason: "Underage" };
      }
    }
    return { valid: true, reason: "All good" };
  };
}

export function countVotesInRegions(regionTree) {
  if (!regionTree || typeof regionTree !== "object") {
    return 0;
  }
  let total = 0;
  if (typeof regionTree.votes === "number") {
    total = total + regionTree.votes;
  }
  if (Array.isArray(regionTree.subRegions)) {
    for (let i = 0; i < regionTree.subRegions.length; i++) {
      let subRegion = regionTree.subRegions[i];
      total = total + countVotesInRegions(subRegion);
    }
  }
  return total;
}

export function tallyPure(currentTally, candidateId) {
  let newTally = { ...currentTally };
  if (newTally[candidateId] === undefined) {
    newTally[candidateId] = 1;
  } else {
    newTally[candidateId] = newTally[candidateId] + 1;
  }
  return newTally;
}
