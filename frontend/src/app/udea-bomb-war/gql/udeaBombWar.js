import gql from "graphql-tag";


export const loginToGame = gql`
mutation loginToGame{
  loginToGame{
    code
    user_id
    character
  } 
}
`;

export const notifyPlayerUpdates = gql`
mutation notifyPlayerUpdates($id: String, $x:Int, $y: Int ){
  notifyPlayerUpdates(id: $id, x: $x, y: $y){
    code
  } 
}
`;



export const playerUpdates = gql `
subscription{
  playerUpdates{
    user_id
    character
    xPosition
    yPosition
  }
}`;
