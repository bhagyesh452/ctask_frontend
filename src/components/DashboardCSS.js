import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid black;
`;
export const Logo = styled.h1``;
export const Uname = styled.h1``;
export const Content = styled.div`
  display: flex;
  flex-direction: row;
`;
export const LeftContent = styled.div`
  border-right: 1px solid black;
  height: 91vh;
  /* border-bottom: 1px solid black; */
  width: 15vw;
`;
export const Highlight = styled.div`
 box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  font-size: 30px;
 background-color: whitesmoke;
  text-align: center;
  padding: 20px;
`;
export const RightContent = styled.div`
  padding: 20px;
`;
export const Heading = styled.div`
  font-size: 25px;
  font-weight: bold;
`;
export const Options = styled.div`
display: flex;
justify-content: space-between;
`;
export const SearchBar = styled.input`
float: right;
  padding: 6px;
  border: 1px solid #999;
  margin-top: 8px;
  margin-right: 16px;
  font-size: 17px;

`;
export const AddBtn = styled.button``;
export const Table = styled.table`
  width: 83vw;
  border-collapse: collapse;
  margin-top: 20px;
`;

export const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

export const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;