export const MacroData = [
    "sendMessage -Start -(getEntity -self)",
    "gameData -set -temp -r -20",
    "gameData -set -temp -sum -300",
    "gameData -set -temp -temp_points -[]",
    `for -reach -(gameData -get -temp -sum) -(&run
        -(&gameData -set -temp
            -temp_points_theta
            -(superMath -approximate
                -(math -multiply
                    -(math -divided
                        -(math -multiply
                            -2
                            -(MATH_CONSTANT_POOL -PI)
                        )
                        -(gameData -get -temp -sum)
                    )
                    -&index
                )
                -4
            )
        )
        -(&gameData -set -temp
            -temp_points_x
            -(math -multiply
                -(superMath -cos
                    -(gameData -get -temp
                        -temp_points_theta
                    )
                )
                -(gameData -get -temp -r)
            )
        )
        -(&gameData -set -temp
            -temp_points_y
            -(math -multiply
                -(superMath -sin
                    -(gameData -get -temp
                        -temp_points_theta
                    )
                )
                -(gameData -get -temp -r)
            )
        )
        -(&gameData -set -temp
            -temp_points
            -(json -list -addChild
                -(gameData -get -temp
                    -temp_points
                )
                -[(gameData -get -temp -temp_points_x),(gameData -get -temp -temp_points_y)]
            )
        )
    )`,
    `for -in -(gameData -get -temp
            -temp_points
        )
        -(&runGameCommand
            -summon minecraft:armor_stand\\S(json -list -getChild -&index -0)\\S-60\\S(json -list -getChild -&index -1)
        )`,
    "sendMessage -OK -(getEntity -self)"
]