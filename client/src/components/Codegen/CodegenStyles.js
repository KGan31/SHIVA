import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

export const SideMenu = styled.aside`
  width: 500px;
  height: 900px;
  border: 1px solid #3498db;
  background: #101522;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: auto;
`;

export const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
  margin-top: -240px;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: -260px;
`;

export const ButtonWrapper = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	flex-flow: wrap;
	gap: 0.5rem;
  margin-top: 1rem;
`;

export const ButtonWrapper2 = styled.div`
width: 100%;
display: flex;
flex-flow: wrap;
justify-content: center;
gap: 0.25rem;
margin-left: auto;
`;

export const Button = styled.button`
	border-radius: 4px;
	background: none;
	white-space: nowrap;
	padding: 10px 20px;
	font-size: 16px;
	color: #fff;
	outline: none;
	border: 2px solid #fff;
	cursor: pointer;
	overflow: hidden;
	position: relative;

	&:hover:before {
		height: 500%;
	}

	&:hover {
		color: #3498db;
	}
`;

export const ButtonS = styled.button`
	border-radius: 4px;
	background: none;
	white-space: nowrap;
	padding: 10px 20px;
	font-size: 16px;
	color: #fff;
	outline: none;
	border: 2px solid #fff;
	cursor: pointer;
	overflow: hidden;
	position: relative;
  top: 50%;
	left: 50%;
	transform: translate(10%, -50%);

	&:before {
		background: #3498db;
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: -1;
		transition: all 0.6s ease;
		width: 100%;
		height: 0%;
		transform: translate(-50%, -50%) rotate(45deg);
	}

	&:hover:before {
		height: 500%;
	}

	&:hover {
		color: black;
	}
`;

export const TextBox = styled.div`
  width: 70%;
  margin-top: 10px;
  display: none; /* Add flexbox */
  align-items: center; /* Center children horizontally */
  justify-content: center; /* Center children vertically */

  ${({ $active }) => $active && `
    display: block;
  `}

  & textarea {
    width: 300%;
    height: 100px; /* Set a fixed height */
    padding: 10px; /* Add padding for better appearance */
    border: 1px solid #ccc; /* Add a border */
    border-radius: 5px; /* Add rounded corners */
    outline: none; /* Remove default outline */
    resize: none; /* Disable textarea resizing */
    font-size: 16px; /* Adjust font size */
    font-family: inherit; /* Use the same font as parent */
    box-sizing: border-box; /* Include padding and border in element's total width and height */
   
  }`;

export const AiSection = styled.section`
  background: #101522;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  position: absolute;
  left: 500px;
  right: 0;
  overflow: auto;
`;

export const PreformattedText = styled.pre`
  width: 100%;
  max-width: 100%;
  overflow: auto;
  height: 200px;
  word-break: break-word;
`;

export const Header = styled.h1`
  color: #3498db;
  align-items: center;
  // display: inline;
  
`;

export const Content = styled.div`
  width: 100%;
  max-width: 100%;
  overflow: auto;
  height: fit-content;
  word-break: break-word;
`;

export const Link = styled.a`
  color: #2b77e7;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;


