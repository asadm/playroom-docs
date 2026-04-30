'use client'

import { useState } from 'react'
import ElectricBorder from './ElectricBorder'
import CopyMasterPromptButton from './CopyMasterPromptButton'
import DropDownMenuForMasterPrompt from './DropDownMenuForMasterPrompt'

export default function InsertCoinPromptGenerator() {
    const [gameId, setGameId] = useState('')

    const effectiveGameId = gameId.trim() || 'PASTE_YOUR_GAME_ID_HERE'

    const promptText: string = `
I am building a multiplayer game using Playroom Kit. I have just created a project on the Playroom Dev Portal and obtained my gameId.
I need you to find the insertCoin() call in my codebase and add my gameId to it so it reads:
insertCoin({ gameId: "${effectiveGameId}" })
If insertCoin is called with no arguments or with an options object that is missing gameId, update it to include the gameId.
Do not change anything else. Only use the official Playroom Kit API.
After making the change, show me the updated line
`

    const [isExpanded, setIsExpanded] = useState(false)
    const lines = promptText.trim().split('\n')
    const visibleLines = isExpanded ? lines : lines.slice(0, 6)
    const showButton = lines.length > 6
    const showBlur = !isExpanded && lines.length > 6

    return (
        <div style={{ marginBottom: '24px' }}>
            <div
                style={{
                    padding: '16px',
                    backgroundColor: '#1a1a1a',
                    borderRadius: '8px',
                    marginBottom: '16px',
                    border: '1px solid #FFB347',
                }}
            >
                <label
                    htmlFor="gameId-input"
                    style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: '600',
                        marginBottom: '8px',
                        color: '#e0e0e0',
                    }}
                >
                    Enter your <code>gameId</code>:
                </label>
                <input
                    id="gameId-input"
                    type="text"
                    placeholder="Paste your gameId here..."
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px 12px',
                        fontSize: '14px',
                        borderRadius: '6px',
                        border: '2px solid #FFB347',
                        backgroundColor: '#2d2d2d',
                        color: '#e0e0e0',
                        fontFamily: 'Courier New, monospace',
                        boxSizing: 'border-box',
                        outline: 'none',
                    }}
                />
            </div>

            <ElectricBorder
                color="#FFB347"
                speed={1}
                chaos={0.12}
                style={{ borderRadius: 3 }}
            >
                <div style={{ position: 'relative', padding: '10px 10px 2px 10px' }}>
                    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 9999, display: 'flex', gap: 8 }}>
                        <DropDownMenuForMasterPrompt text={promptText} />
                        <CopyMasterPromptButton text={promptText} />
                    </div>
                    <pre style={{ padding: '5px', paddingTop: '34px', opacity: 0.8, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'Courier New', fontSize: '14px' }}>
                        {visibleLines.map((line, i) => (
                            <span key={i} style={{ display: 'block', filter: showBlur && i === 5 ? 'blur(2px)' : 'none', opacity: showBlur && i === 5 ? 0.6 : 1 }}>
                                {line}
                            </span>
                        ))}
                    </pre>
                    {showButton && (
                        <div style={{ textAlign: 'center', marginTop: isExpanded ? '10px' : '-28px', position: 'relative', zIndex: 1 }}>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                style={{ padding: '4px 12px', fontSize: '14px', cursor: 'pointer', background: 'transparent', border: 'none', color: '#fff', fontFamily: 'Courier New' }}
                            >
                                {isExpanded ? 'Show less' : 'Show all'}
                            </button>
                        </div>
                    )}
                </div>
            </ElectricBorder>
        </div>
    )
}
