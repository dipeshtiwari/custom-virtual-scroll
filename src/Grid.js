import React, { memo, useMemo, useRef, useState, useEffect, useCallback } from "react";
import jsonData from './data.json';

const useScrollAware = () => {

  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef();

  const onScroll = (e) =>
    requestAnimationFrame(() => {
      setScrollTop(e.target.scrollTop);
    });

  useEffect(() => {
    const scrollContainer = ref.current;

    setScrollTop(scrollContainer.scrollTop);
    scrollContainer.addEventListener("scroll", onScroll);
    return () => scrollContainer.removeEventListener("scroll", onScroll);
  }, []);
  
  return [scrollTop, ref];
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

const Grid = () => {
    const itemCount = 1000;
    const renderAhead = 20;
    const height = 300;

    const getChildHeight = useCallback(index => 30 + (index % 10), []);


    const childPositions = useMemo(() => {
        let results = [0];
        for (let i = 1; i < itemCount; i++) {
            results.push(results[i - 1] + getChildHeight(i - 1));
        }
        return results;
    }, [getChildHeight, itemCount]);

    const [scrollTop, ref] = useScrollAware();
    const totalHeight =
        childPositions[itemCount - 1] + getChildHeight(itemCount - 1);

    const firstVisibleNode = useMemo(
        () => findStartNode(scrollTop, childPositions, itemCount),
        [scrollTop, childPositions, itemCount]
    );

    const startNode = Math.max(0, firstVisibleNode - renderAhead);

    const lastVisibleNode = useMemo(
        () => findEndNode(childPositions, firstVisibleNode, itemCount, height),
        [childPositions, firstVisibleNode, itemCount, height]
    );
    const endNode = Math.min(itemCount - 1, lastVisibleNode + renderAhead);
    const visibleNodeCount = endNode - startNode + 1;
    const offsetY = childPositions[startNode];
    // console.log(height, scrollTop, startNode, endNode);
  

    // const {visibleNodeCount, startNode, offsetY, totalHeight}  = useVirtualScroll({
    //     itemCount:jsonData.length,
    //     height:height, 
    //     childHeight:30,
    //     renderAhead:10, 
    //     scrollTop:scrollTop
    // });

    console.log('virtualScroll', {visibleNodeCount, startNode, offsetY})
    const renderChildRow = (childs) => {
        return childs.map((child, index) => (
        <tr style={{
            height: 30,
            lineHeight: "30px",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 10px"
        }}
            key={'child+'+index}>
                <td>{child.id}</td>
                <td>{child.first_name}</td>
        </tr>
        )) 
    }

    const visibleChildren = useMemo(
        () =>{
        return new Array(visibleNodeCount)
        .fill(null)
        .map((_, index) => (
        <>
        <tr style={{
            height: 30,
            lineHeight: "30px",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 10px"
        }}
            key={index + startNode} index={index +startNode}>
                <td>{jsonData[index + startNode].id}</td>
                <td>{jsonData[index + startNode].first_name}</td>
        </tr>
        {/* {jsonData[index + startNode]?.child && renderChildRow(jsonData[index + startNode].child)} */}
        </>
        ))},
        [startNode, visibleNodeCount]
    );

    return <div style={{ height, overflow: "auto" }} ref={ref}>
      <table
        className="viewport"
        style={{
          overflow: "hidden",
          willChange: "transform",
          height: totalHeight,
          position: "relative"
        }}
      >
        <tbody
          style={{
            willChange: "transform",
            transform: `translateY(${offsetY}px)`
          }}
        >
          {visibleChildren}
        </tbody>
      </table>
    </div>

}

export default memo(Grid);