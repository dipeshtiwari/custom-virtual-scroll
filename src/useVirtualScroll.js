import React, {
  useMemo,
  useCallback
} from "react";

const useVirtualScroll = ({height, itemCount, scrollTop, renderAhead}) => {

    const getChildHeight = useCallback(index => 30 + (index % 10), []);
    
    const childPositions = useMemo(() => {
        let results = [0];
        for (let i = 1; i < itemCount; i++) {
            results.push(results[i - 1] + getChildHeight(i - 1));
        }
        return results;
    }, [getChildHeight, itemCount]);

    const totalHeight = childPositions[itemCount - 1] + getChildHeight(itemCount - 1);

    const firstVisibleNode = useMemo(
        () => findStartNode(scrollTop, childPositions, itemCount),
        [scrollTop, childPositions, itemCount]
    );
    const lastVisibleNode = useMemo(
        () => findEndNode(childPositions, firstVisibleNode, itemCount, height),
        [childPositions, firstVisibleNode, itemCount, height]
    );

    const startNode = Math.max(0, firstVisibleNode - renderAhead);
    const endNode = Math.min(itemCount - 1, lastVisibleNode + renderAhead);
    const visibleNodeCount = endNode - startNode + 1;
    const offsetY = childPositions[startNode];

  return {
      startNode,
      visibleNodeCount,
      totalHeight,
      offsetY
  }
}

function findStartNode(scrollTop, nodePositions, itemCount) {
  let startRange = 0;
  let endRange = itemCount - 1;
  while (endRange !== startRange) {
    // console.log(startRange, endRange);
    const middle = Math.floor((endRange - startRange) / 2 + startRange);

    if (
      nodePositions[middle] <= scrollTop &&
      nodePositions[middle + 1] > scrollTop
    ) {
      // console.log("middle", middle);
      return middle;
    }

    if (middle === startRange) {
      // edge case - start and end range are consecutive
      // console.log("endRange", endRange);
      return endRange;
    } else {
      if (nodePositions[middle] <= scrollTop) {
        startRange = middle;
      } else {
        endRange = middle;
      }
    }
  }
  return itemCount;
}

function findEndNode(nodePositions, startNode, itemCount, height) {
  let endNode;
  for (endNode = startNode; endNode < itemCount; endNode++) {
    // console.log(nodePositions[endNode], nodePositions[startNode]);
    if (nodePositions[endNode] > nodePositions[startNode] + height) {
      // console.log(endNode);
      return endNode;
    }
  }
  return endNode;
}

export default useVirtualScroll;