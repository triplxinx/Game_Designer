const AssetDefinitions = {
    sprites: {
        characters: {
            wario: {
                default: 'sprites/wario/default.png',
                running: 'sprites/wario/running.png',
                sneaking: 'sprites/wario/sneaking.png',
                animations: {
                    run: {
                        frames: 8,
                        speed: 0.1
                    },
                    sneak: {
                        frames: 6,
                        speed: 0.15
                    }
                }
            },
            luigi: {
                default: 'sprites/luigi/default.png',
                cycling: 'sprites/luigi/cycling.png',
                animations: {
                    cycle: {
                        frames: 6,
                        speed: 0.12
                    }
                }
            }
        },
        locations: {
            hostel: {
                exterior: 'locations/hostel_exterior.png',
                lobby: 'locations/hostel_lobby.png',
                hallway: 'locations/hostel_hallway.png'
            },
            street: {
                main: 'locations/street_main.png',
                alley: 'locations/street_alley.png',
                park: 'locations/central_park.png'
            }
        }
    },
    audio: {
        effects: {
            gunshot: 'audio/effects/gunshot.mp3',
            bicycle_bell: 'audio/effects/bicycle_bell.mp3',
            police_siren: 'audio/effects/police_siren.mp3'
        },
        ambient: {
            street_noise: 'audio/ambient/street_noise.mp3',
            hostel_lobby: 'audio/ambient/hostel_ambient.mp3'
        }
    },
    ui: {
        icons: {
            inventory: 'ui/inventory_icon.png',
            dialogue: 'ui/dialogue_icon.png',
            save: 'ui/save_icon.png'
        }
    }
};
