module Main exposing (..)

import Html exposing (..)
import Html.Events exposing (onClick)
import Time exposing (..)


-- Model


type Page
    = Menu
    | Timer


type alias Model =
    { page : Page, time : Int }


type Msg
    = Clock Time
    | Pause
    | Reset
    | Resume



-- View


view : Model -> Html Msg
view model =
    case model.page of
        Menu ->
            div []
                [ button [ onClick Reset ] [ text "reset" ]
                , button [ onClick Resume ] [ text "resume" ]
                ]

        Timer ->
            div [ onClick Pause ] [ text (toString model.time) ]



-- Controller


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Clock _ ->
            { model
                | time =
                    if model.page == Menu then
                        model.time
                    else
                        max 0 (model.time - 1)
            }
                ! []

        Pause ->
            { model | page = Menu } ! []

        Reset ->
            { page = Timer, time = 25 * 60 } ! []

        Resume ->
            { model | page = Timer } ! []


subscribe : Model -> Sub Msg
subscribe _ =
    Sub.batch [ every second Clock ]



-- Main


main : Program Never Model Msg
main =
    program
        { init = { page = Menu, time = 0 } ! []
        , update = update
        , view = view
        , subscriptions = subscribe
        }
