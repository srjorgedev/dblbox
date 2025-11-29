export function log(text: string): void {
    const currentMessage = text

    let newMessage: string
    if (currentMessage.includes(":")) {
        newMessage = currentMessage.replace(":", `[${new Date().toLocaleTimeString()}]: `)
    }
    else {
        newMessage = `[${new Date().toLocaleTimeString()}]:${currentMessage}`
    }

    console.log(newMessage)
}
