import React, { useEffect, useRef, useState, Fragment } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
var AWS = require("aws-sdk");

export default (props) => {

  const [highScores, setHighScores] = useState([])
  const [highScoreNameText, setHighScoreNameText] = useState()
  const [submitDisable, setSubmitDisable] = useState(true)
  const [showNameInput, setShowNameInput] = useState(true)
  const [errorText, setErrorText] = useState("")

  useEffect(() => {


    fetch('/getHighScore')
      .then(response => response.json())
      .then(dataResponse => {
        
        if(!dataResponse.Items)
          return
        //TO DO Deal with can't retrieve  highscore in the ui

        
        let data = dataResponse.Items.map(item => AWS.DynamoDB.Converter.unmarshall(item))
        data = data.slice(0, 5)

        let playerName = '[You]'
        if (props.aiUsedFlag) {
          playerName = '[AI]'
        }

        data.push({ name: playerName, score: props.gameOverScore, currentPlayer: true })

        data.sort((a, b) => b.score - a.score)

        //Hide input if player doesnt make it into highscore list
        // and there are other highscore
        if (data.length > 1 && data[data.length - 1].currentPlayer)
          setShowNameInput(false)

        setHighScores(data)
      })

  }, [])


  useEffect(() => {
    if (errorText.length)
      setSubmitDisable(false)
    else
      setSubmitDisable(true)
  }, [errorText])


  const formatHighscore = () => {
    {
      return highScores.map((highScore, index) => {
        let ranking
        if (index == 0)
          ranking = '🥇'
        else if (index == 1)
          ranking = '🥈'
        else if (index == 2)
          ranking = '🥉'


        const playerHighlight = (cssClass) => {
          if (highScore.currentPlayer)
            return cssClass + " highScorePlayerHighlight"
          else
            return cssClass
        }

        return (
          <React.Fragment key={index} >
            <div key={ranking + index} style={{ fontSize: '30px' }}>{ranking}</div>
            <div key={highScore.name + index} className={playerHighlight("highScorePlayerName")}> {highScore.name}</div>
            <div key={highScore.score + index} className={playerHighlight("highScorePlayerScore")}>{highScore.score}</div>
          </React.Fragment>)
      })
    }
  }

  const highScoreSubmit = () => {
    let newHighScore = [...highScores]
    let currentPlayerObj = newHighScore.find(highScore => highScore.currentPlayer == true)

    currentPlayerObj.name = highScoreNameText

    setHighScores(newHighScore)
    setShowNameInput(false)

    fetch('/putHighScore', {
           method: 'POST',
           headers: {'Content-Type': 'application/json'},
           body: JSON.stringify(currentPlayerObj)
    }).then(response => response.json())
      .then(data => console.log(data))
  }

  const textInputHandler = (e) => {
    if (e.target.value.length == 0)
      setErrorText("")

    if (e.target.value.length > 0) {
      if (e.target.value.length > 10) {
        setErrorText("Please enter less than 10 characters")
      } else {
        setErrorText("")
        setHighScoreNameText(e.target.value)
        setSubmitDisable(false)
      }

    } else {
      setSubmitDisable(true)
    }
  }

  const renderNameInput = () => {
    if (props.aiUsedFlag)
      return <div className="highScoreHeader">AI Used  🤖</div>

    if (props.gameOverScore == 0)
      return <div className="highScoreHeader">No score 😟</div>

    if (showNameInput) {
      return (<React.Fragment>
        <div style={{ "fontSize": "25px", 'fontWeight': 'bold', paddingBottom: '4px' }}>New High Score</div>
        <div style={{ "fontSize": "20px" }}>Enter Name</div>

        <div className="highscoreNameInputContainer">
          <TextField onChange={(e) => textInputHandler(e)}
            id="outlined-basic" label="Name" variant="outlined"
            helperText={errorText}
            error={errorText.length === 0 ? false : true}
          />
          <Button
            variant="contained"
            color="default"
            disableRipple
            onClick={() => highScoreSubmit()}
            disabled={submitDisable}>
            Submit
            </Button>
        </div>
      </React.Fragment>)

    }
  }

  const renderHighScore = () => {
    if (props.gameMode == "singlePlayer") {
      return <div>
        <div className="highScoreHeader">High Score</div>
        <div className="highscoreGridContainerHeader">
          <div className="highScorePlayerName"> Name </div>
          <div className="highScorePlayerScore">Score</div>
        </div>
        <div className="highscoreGridContainer">
          {formatHighscore()}
        </div>
        {renderNameInput()}
      </div>
    } else {
      return <div style={{ 'paddingTop': '5%' }}>Score {props.gameOverScore}</div>
    }
  }

  return (
    <div>
      {renderHighScore()}
    </div>
  )
}