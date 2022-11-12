import { useEffect, useState, memo } from "react"
import CharacterList from "./CharacterList"
import ErrorMessage from "../secondaryComponents/errorMessage/Error"
import Spinner from "../secondaryComponents/spinner/Spinner"
import useMarvelAPI from "./../../services/Api"
import "./characterList.scss"


const CharacterListContainer = (props) => {

  const [charList, setCharList] = useState([])
  const [newLoading, setNewLoading] = useState(false)
  const [end, setEnd] = useState(false)
  const [offsetCharacters, setOffsetCharacters] = useState(125)
  const { getAllCharacters, loading, error, clearError } = useMarvelAPI()

  const downloadComplete = (charListNew) => {
    const end = charListNew.total - offsetCharacters > 9 ? false : true
    setCharList((charList) => [...charList, ...charListNew.allCharacter])
    setEnd(end)
    setOffsetCharacters((offsetCharacters) => offsetCharacters + 9)
  }
  const charListLoading = (offset, initial) => {
    initial ? setNewLoading(false) : setNewLoading(true)
    clearError()
    getAllCharacters(offset)
      .then(downloadComplete)
      .finally(() => {
        setNewLoading(false)
      })
  }
  const loadMoreCharacter = (offset) => charListLoading(offset)

  useEffect(() => charListLoading(offsetCharacters, true), [])

  const errorImg = error && <ErrorMessage />
  const spinner = loading && !newLoading && <Spinner marginTop={50} />
  const styleBtn = {
    display: (end || (loading && !newLoading)) && "none",
    opacity: newLoading && 0.5,
  }
  // const styleDiv = { height: charList.length === 0 && 500 }

  //debugger
  console.log("Render Char List")
  return (
    <div className="char__list">
      {errorImg}
      {spinner}
      <CharacterList charList={charList} setCharItemId={props.setCharItemId} />
      <button
        className="button button__main button__long"
        disabled={newLoading}
        style={styleBtn}
        onClick={() => loadMoreCharacter(offsetCharacters)}
      >
        <div className="inner">
          {newLoading ? "Please, wait..." : "load more"}
        </div>
      </button>
    </div>
  )
}

export default memo(CharacterListContainer)
