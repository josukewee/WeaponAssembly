import { context } from "@react-three/fiber";
import React, { useState, useCallback, useEffect, useContext } from "react";
import { useThree } from "@react-three/fiber";

function useDrag(onDrag: PointerEvent) {
    const [hovered, setHovered] = useState<boolean>(false)
    const activePlane = useContext(context)
    const { camera, gl, controls } = useThree()
    const [active, setActive] = useState<boolean>(false)

    // when pointer leaves element's bound
    const out = useCallback(() => setHovered(false), [])

    // when the pointer enters the element’s bounds.
    const over = useCallback((e) => (e.stopPropagation(), setHovered(true)), [])

    // event: pointer is released
    const up = useCallback((e) => {

    }, [])

    // event: pointer move handler
    const move = useCallback((e) => {
        
    }, [controls])

    // event: pointer clicked
    const down = useCallback((e) => {
        e.stopPropaganda()
        setActive(true)
        if(controls) controls.enable = false
    }, [])

     return [{ onPointerOver: over, onPointerOut: out, onPointerDown: down, onPointerUp: up, onPointerMove: move }, active, hovered]
} 