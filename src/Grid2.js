import React, {
  memo,
  useMemo,
  useState,
} from "react";
import jsonData from './data.json';
import useVirtualScroll from "./useVirtualScroll";
import useScrollAware from "./useScrollAware";

// Generic hook for detecting scroll:
// VirtualScroll component

const Grid2 = ({
}) => {
    const itemCount = jsonData.length;
    const renderAhead = 20;
    const height = 700;
    const [subrows, setSubRows] = useState([]);
    const [scrollTop, ref] = useScrollAware();
    const {startNode, visibleNodeCount, totalHeight, offsetY} = useVirtualScroll({height, itemCount, scrollTop, renderAhead});

    const openChild = (id) => {
      
        const copySubrows = [...subrows];        
        if(copySubrows.includes(id)){
          
          const indexof = copySubrows.indexOf(id);
            copySubrows.splice(indexof,1);
        }else{
          copySubrows.push(id);
        }
        console.log('openchild', copySubrows, id)
        setSubRows([...copySubrows])
    }
  
    const ChildRow = ({childs}) => {
        return childs && childs.map((child, index) => (
        <tr style={{
            height: 30 + (index % 10),
            lineHeight: "30px",
            display: "flex",
            justifyContent: "space-between",
            padding: "0 10px"
        }}
            key={'child+'+index}>
                <td>{child.projectStadiumId}</td>
                <td>{child.shortName}</td>
        </tr>
        )) 
    }

  const Row = memo(({ index }) => (
  <><tr
    style={{
      height: 30 + (index % 10),
      lineHeight: "30px",
      display: "flex",
      justifyContent: "space-between",
      padding: "0 10px",
      background: (index % 2) ? '#CCC':'#EEE' ,
      border:'1px',
      borderColor:'#000'
    }}
    className="row"
    key={index}
  >
        {/* <td onClick={()=>openChild(jsonData[index].projectId)}>{subrows.includes(jsonData[index].projectId) ? '-' : '+'}</td> */}
        {/* <td>{'row'+ index}</td> */}
        <td>{jsonData[index].projectId}</td>
        <td>{jsonData[index].shortName}</td>
  </tr>
    {/* {jsonData[index + startNode]?.stadiumList && subrows.includes(jsonData[index].projectId) && <ChildRow childs={jsonData[index + startNode].stadiumList} />} */}
    </>  
));

const visibleChildren = useMemo(
    () =>
      new Array(visibleNodeCount)
        .fill(null)
        .map((_, index) => (
          <Row key={index + startNode} index={index + startNode} />
        )),
    [startNode, visibleNodeCount, Row]
  );

  
  return (
    <div style={{ height, overflow: "auto" }} ref={ref}>
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
  );
};

export default memo(Grid2);
