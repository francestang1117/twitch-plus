package com.frances.twitch.hello;

import java.util.*;

public class test {

    public List<List<Integer>> combinationSum2(int[] candidates, int target) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(candidates);
        dfs(candidates, 0, target, new LinkedList<>(), res);
        return res;
    }

    private void dfs(int[] candidates, int start, int remain, List<Integer> path, List<List<Integer>> res) {
        // base case
        if (remain == 0) {
            res.add(new LinkedList<>(path));
            return;
        }

        if (remain < 0) return;

        // backtracking
        for (int i = start; i < candidates.length; i++) {
            if (i > start && candidates[i] == candidates[i - 1]) continue;
            path.add(candidates[i]);
            dfs(candidates, i + 1, remain - candidates[i], path, res);
            path.removeLast();
        }
    }


    public static void main(String[] args) {
        test test = new test();
        List<List<Integer>> res = test.combinationSum2(new int[]{10,1,2,7,6,1,5}, 8);
        System.out.println(res);
    }
}
