import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNovaStore } from '../../../state/useNovaStore'
import { useProgressStore } from '../../../state/useProgressStore'
import { useConversationStore } from '../../../state/useConversationStore'
import { useMusicStore } from '../../../state/useMusicStore'
import { usePhotosStore } from '../../../state/usePhotosStore'
import './ConversationsApp.scss'

interface Message {
  id: number
  sender: 'user' | 'qamar'
  text: string
  time: string
}

interface Conversation {
  id: string
  icon: string
  title: string
  subtitle: string
  date: string
  messages: Message[]
  endingMessage?: string
  novaMessage?: string
}

const conversations: Conversation[] = [
  {
    id: 'first-contact',
    icon: '👋',
    title: 'First Contact',
    subtitle: 'A simple message that changed everything.',
    date: '25/06/2023',
    endingMessage: "And that's how it all began... Two strangers, one message, and a story that was about to change everything. 💫",
    novaMessage: "You just unlocked a new picture! You should go see it. 📸",
    messages: [
      { id: 1, sender: 'qamar', text: "*answering to a story* Mashallah, you're beautiful.", time: '14:32' },
      { id: 2, sender: 'user', text: "Thank you so much!", time: '14:35' },
      { id: 3, sender: 'qamar', text: "Can I ask where you're from?", time: '14:36' },
      { id: 4, sender: 'user', text: "Annaba! And you?", time: '14:37' },
      { id: 5, sender: 'qamar', text: "Mashallah, I didn't know there were such beautiful girls in Annaba. I'm from Algiers", time: '14:40' },
      { id: 6, sender: 'user', text: "Haha, don't you have beautiful girls in Algiers? ", time: '14:42' },
      { id: 7, sender: 'qamar', text: "Not like you... ", time: '14:45' },
    ],
  },
  {
    id: 'first-real-talk',
    icon: '💬',
    title: 'The First Real Talk',
    subtitle: 'When curiosity became something more.',
    date: '28/06/2023',
    novaMessage: "You just unlocked a new song AND a new picture! Go check them out! 🎵📸",
    messages: [
      { id: 1, sender: 'user', text: "*replying to your story* Damn, you're gorgeous. ", time: '17:12' },
      { id: 2, sender: 'qamar', text: "Haha, thank you! Come on, tell me something, I'm bored. ", time: '17:14' },
      { id: 3, sender: 'user', text: "Hmm, what do you want to talk about?", time: '17:16' },
      { id: 4, sender: 'qamar', text: "I don't know, anything you want. Tell me about yourself. ", time: '17:18' },
      { id: 5, sender: 'user', text: "Well, what do you want to know? I'm an open book. ", time: '17:20' },
      { id: 6, sender: 'qamar', text: "As you like let's start with the basics ", time: '17:22' },
    ],
  },
  {
    id: 'first-picture',
    icon: '📸',
    title: 'Lets see how he looks like',
    subtitle: 'First impression.',
    date: '26/06/2023',
    novaMessage: "A picture is worth a thousand words. But 'baby face' is only two. 😂",
    messages: [
      { id: 1, sender: 'qamar', text: "I haven't seen your face yet shall you send me a picture ? ", time: '17:14' },
      { id: 2, sender: 'user', text: "Yeah sure ", time: '17:16' },
      { id: 3, sender: 'user', text: "* sending a picture *", time: '17:18' },
      { id: 4, sender: 'qamar', text: "You look cute , you have a baby face also !", time: '17:20' },
      { id: 5, sender: 'user', text: "Thank you...i guess hhh", time: '17:22' },
    ],
  },
  {
    id: 'nickname',
    icon: '👨‍🍳',
    title: 'A Nickname Is Born',
    subtitle: 'Si Chef enters the chat.',
    date: '03/07/2023',
    novaMessage: "Si Chef! I love that nickname. It's so... them. 🍳",
    messages: [
      { id: 1, sender: 'qamar', text: "What are you doing right now? ", time: '19:45' },
      { id: 2, sender: 'user', text: "Just cooking my dinner. ", time: '19:47' },
      { id: 3, sender: 'qamar', text: "Hmm, so you actually know how to cook?", time: '19:48' },
      { id: 4, sender: 'user', text: "Of course I do! I'm a man of many talents. ", time: '19:50' },
      { id: 5, sender: 'qamar', text: "Okay then... from now on, I'm calling you Si Chef! ", time: '19:52' },
      { id: 6, sender: 'user', text: "Si Chef? Hahaha, I'll take it as a compliment  ", time: '19:55' },
    ],
  },
  {
    id: 'jealousy',
    icon: '😏',
    title: 'A Little Jealousy',
    subtitle: 'Someone is catching feelings...',
    date: '10/07/2023',
    endingMessage: "And just like that, Qamar realized she felt something real. A feeling that would only grow stronger with time... 💚",
    novaMessage: "Ooh, jealousy! That's when you know it's getting serious. 🫣",
    messages: [
      { id: 1, sender: 'qamar', text: "Hmm, you're not wearing much in your last story... ", time: '15:45' },
      { id: 2, sender: 'user', text: "I'm just showing my gym progress hhhh", time: '15:48' },
      { id: 3, sender: 'qamar', text: "Hmmmm... ", time: '15:50' },
      { id: 4, sender: 'user', text: "Wait... is there something wrong? Are you getting a bit jealous, maybe? ", time: '15:52' },
      { id: 5, sender: 'qamar', text: "Me? Jealous? Not at all! ", time: '15:54' },
      { id: 6, sender: 'user', text: "Really? Then I'll post another one", time: '15:56' },
      { id: 7, sender: 'qamar', text: "Do it and you're dead ", time: '15:58' },
    ],
  },
  {
    id: 'almost-confession',
    icon: '🫣',
    title: 'Do You Like Me?',
    subtitle: 'So close to a confession.',
    date: '11/07/2023',
    novaMessage: "So close to a confession! The tension is killing me. And I'm not even alive. 😅",
    messages: [
      { id: 1, sender: 'user', text: "So... do you actually like me? Or am I just imagining things? ", time: '18:35' },
      { id: 2, sender: 'qamar', text: "I... I don't know. I like you as a friend, but also... in a different way. ", time: '18:40' },
      { id: 3, sender: 'user', text: "Hmmmm... so you DO like me! ", time: '18:42' },
      { id: 4, sender: 'qamar', text: "I said I'm not sure! Not yet... ", time: '18:44' },
      { id: 5, sender: 'user', text: "Take your time. I'm not going anywhere. ", time: '18:46' },
    ],
  },
  {
    id: 'first-i-love-you',
    icon: '❤️',
    title: 'The First "I Love You"',
    subtitle: 'A song, a promise, and three little words.',
    date: '15/07/2023',
    endingMessage: "Three words that changed everything. And she meant every single one of them. ❤️",
    novaMessage: "They said it! THEY SAID IT! I'm not crying, you're crying. 😭❤️",
    messages: [
      { id: 1, sender: 'user', text: "Oh god, I hate that song.  *replying to a voice message*", time: '21:35' },
      { id: 2, sender: 'qamar', text: "Haha! Sing it for me! ", time: '21:38' },
      { id: 3, sender: 'user', text: "No way, I can't sing! ", time: '21:40' },
      { id: 4, sender: 'qamar', text: "Come ooon, pleaaaase! ", time: '21:42' },
      { id: 5, sender: 'user', text: "Alright... but if I do it, you have to say you love me. Deal? ", time: '21:44' },
      { id: 6, sender: 'qamar', text: "Hmm... okay. Deal. ", time: '21:46' },
      { id: 7, sender: 'user', text: "*sent a voice message singing* ", time: '21:50' },
      { id: 8, sender: 'user', text: "Done... I'm waiting now. ", time: '21:52' },
      { id: 9, sender: 'qamar', text: "HAHAHA that was actually so funny! Okay okay... 😂", time: '21:55' },
      { id: 10, sender: 'qamar', text: "I love you. ❤️", time: '21:58' },
      { id: 11, sender: 'user', text: "I love you tooo ❤️", time: '21:59' },
    ],
  },
  {
    id: 'growing-closer',
    icon: '💕',
    title: 'Getting attached',
    subtitle: 'Late nights and endless conversations.',
    date: '22/07/2023',
    novaMessage: "Did you notice how she says 'hobi' in every message now? That's adorable. 💕",
    messages: [
      { id: 1, sender: 'qamar', text: "good morning hobii", time: '10:35' },
      { id: 2, sender: 'qamar', text: "hobi miss youu 🎤", time: '10:50' },
      { id: 3, sender: 'qamar', text: "hobi where are youuu", time: '21:40' },
      { id: 4, sender: 'qamar', text: "i don't love youu", time: '21:42' },
      { id: 5, sender: 'qamar', text: "im lying i do love you...", time: '21:44' },
      { id: 6, sender: 'qamar', text: "where are youuu ", time: '21:46' },
      { id: 7, sender: 'user', text: "hii hobiii ", time: '21:50' },
      { id: 8, sender: 'qamar', text: "tfoo where were you ", time: '21:52' },
      { id: 9, sender: 'user', text: "asleep sorry...😅", time: '21:55' },
      { id: 10, sender: 'qamar', text: "tfoo hobi ", time: '21:57' },
      { id: 11, sender: 'user', text: "3ssal love youuu ", time: '21:58' },
    ],
  },
  {
    id: 'wallpaper',
    icon: '📱',
    title: 'It means a lot',
    subtitle: 'Attachment and importance.',
    date: '22/07/2023',
    novaMessage: "Putting someone as your wallpaper? That's a whole new level of commitment. 📱",
    messages: [
      { id: 1, sender: 'user', text: " Look what i have done ", time: '10:35' },
      { id: 2, sender: 'user', text: "*sending a picture*", time: '10:50' },
      { id: 3, sender: 'qamar', text: "hobi that's so cute you put my picture as your phone wallpaper", time: '10:52' },
      { id: 4, sender: 'user', text: "it's because i love youu", time: '10:53' },
      { id: 5, sender: 'qamar', text: "but what if someone sees it?", time: '10:55' },
      { id: 6, sender: 'user', text: "idc it's ok ( im lying i can't keep it ) ", time: '10:56' },
      { id: 7, sender: 'user', text: "hhhh it's ok hobi love you", time: '10:57' },
      { id: 8, sender: 'qamar', text: "love you too habibti ", time: '10:59' },
    ],
  },
  {
    id: 'favorite-memories',
    icon: '🔥',
    title: 'Getting closer',
    subtitle: 'So many reasons to smile.',
    date: '01/08/2023',
    novaMessage: "Things are heating up! I'll just... look away. Respectfully. 🔥",
    messages: [
      { id: 1, sender: 'qamar', text: "sent a picture ", time: '10:35' },
      { id: 2, sender: 'user', text: "wow you look so prettyyy ", time: '10:50' },
      { id: 3, sender: 'qamar', text: "thank you hobiii", time: '10:52' },
      { id: 4, sender: 'user', text: "but why are you censoring your cleavage it's not fair ", time: '10:54' },
      { id: 5, sender: 'qamar', text: " Im a bit shy haha ", time: '10:55' },
      { id: 6, sender: 'user', text: " come on i wanna see pleaase ", time: '10:56' },
      { id: 7, sender: 'qamar', text: "ok ok tfoo * sends the picture again * ", time: '10:57' },
      { id: 8, sender: 'user', text: " I love itt", time: '10:58' },
    ],
  },
  {
    id: 'today',
    icon: '🔮',
    title: 'Today & Always',
    subtitle: 'The newest chapter of our story.',
    date: 'Present',
    messages: [],
  },
]

const UNLOCK_ORDER = [
  'first-contact',
  'first-real-talk',
  'first-picture',
  'nickname',
  'jealousy',
  'almost-confession',
  'first-i-love-you',
  'growing-closer',
  'wallpaper',
  'favorite-memories',
]

const NOVA_LOCKED_MESSAGES = [
  "Hey! You can't skip ahead. Memories have an order, you know?",
  "Nope. Not yet. You wouldn't read a book backwards, would you?",
  "Patience, human. The best stories unfold slowly.",
  "Locked! I could open it... but I won't. Rules are rules.",
  "Uh-uh. Finish the previous conversation first. I'm watching you.",
]

export default function ConversationsApp() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const showMessage = useNovaStore((state) => state.showMessage)
  const advance = useProgressStore((state) => state.advance)
  const unlockedIds = useConversationStore((state) => state.unlockedIds)
  const unlockConv = useConversationStore((state) => state.unlock)
  const isUnlocked = useConversationStore((state) => state.isUnlocked)
  const markNovaMessageShown = useConversationStore((state) => state.markNovaMessageShown)
  const isNovaMessageShown = useConversationStore((state) => state.isNovaMessageShown)
  const unlockTrack = useMusicStore((state) => state.unlockTrack)
  const unlockPhoto = usePhotosStore((state) => state.unlockPhoto)

  const selectedConversation = conversations.find((c) => c.id === selectedId)

  const unlockNext = (currentId: string) => {
    const currentIndex = UNLOCK_ORDER.indexOf(currentId)
    const nextId = UNLOCK_ORDER[currentIndex + 1]
    if (nextId && !unlockedIds.includes(nextId)) {
      unlockConv(nextId)
      advance(3)
    }

    if (currentId === 'first-contact') {
      unlockPhoto('photo-2')
    }

    if (currentId === 'first-real-talk') {
      unlockTrack('first-song')
      unlockPhoto('photo-1')
      setTimeout(() => {
        showMessage("You just unlocked a new song AND a new picture! Go check them out! 🎵📸", 'interruptible')
      }, 1500)
    }
  }

  const handleSelectConversation = (convId: string) => {
    if (convId === 'today') {
      showMessage("This one isn't available yet. Coming in the next update, I suppose... ✨", 'interruptible')
      return
    }

    if (isUnlocked(convId)) {
      setSelectedId(convId)
      unlockNext(convId)

      const conversation = conversations.find((c) => c.id === convId)
      if (conversation?.novaMessage && !isNovaMessageShown(convId)) {
        markNovaMessageShown(convId)
        setTimeout(() => {
          showMessage(conversation.novaMessage!, 'interruptible')
        }, 1500)
      }
    } else {
      const randomMessage = NOVA_LOCKED_MESSAGES[Math.floor(Math.random() * NOVA_LOCKED_MESSAGES.length)]
      showMessage(randomMessage, 'interruptible')
    }
  }

  return (
    <div className="conversations-app">
      <div className="conversations-sidebar">
        <div className="sidebar-header">
          <div className="archive-icon">📁</div>
          <h2 className="archive-title">Conversation Archive</h2>
          <p className="archive-subtitle">Every memory has its own story.</p>
        </div>

        <div className="conversation-list">
          {conversations.map((conv) => {
            const unlocked = isUnlocked(conv.id)
            return (
              <motion.div
                key={conv.id}
                className={`conversation-card ${selectedId === conv.id ? 'selected' : ''} ${!unlocked ? 'locked' : ''}`}
                whileHover={unlocked ? { scale: 1.02, x: 2 } : { scale: 1.01 }}
                onClick={() => handleSelectConversation(conv.id)}
              >
                <div className="card-icon">{unlocked ? conv.icon : '🔒'}</div>
                <div className="card-content">
                  <div className="card-title">
                    {conv.title}
                    {unlocked && selectedId !== conv.id && <span className="checkmark">✓</span>}
                  </div>
                  <div className="card-subtitle">{conv.subtitle}</div>
                  <div className="card-date">{conv.date}</div>
                </div>
                {!unlocked && (
                  <div className="lock-icon">🔒</div>
                )}
              </motion.div>
            )
          })}
        </div>

        <div className="sidebar-footer">
          <span className="footer-icon">💾</span>
          <span>MemoryOS v1.0</span>
        </div>
      </div>

      <div className="conversations-main">
        <AnimatePresence mode="wait">
          {selectedConversation ? (
            <motion.div
              key={selectedConversation.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="chat-container"
            >
              <div className="chat-header">
                <div className="chat-avatar">{selectedConversation.icon}</div>
                <div className="chat-header-info">
                  <h3 className="chat-title">{selectedConversation.title}</h3>
                  <span className="chat-date">{selectedConversation.date}</span>
                </div>
                <div className="memory-badge">Memory Restored</div>
              </div>

              <div className="chat-messages">
                <div className="chat-background" />

                {selectedConversation.messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: msg.id * 0.1, duration: 0.4 }}
                    className={`message-row ${msg.sender}`}
                  >
                    <div className="message-avatar">
                      {msg.sender === 'qamar' ? selectedConversation.icon : '💭'}
                    </div>
                    <div className={`message-bubble ${msg.sender}`}>
                      <p className="message-text">{msg.text}</p>
                      <span className="message-time">{msg.time}</span>
                    </div>
                  </motion.div>
                ))}

                {selectedConversation.endingMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (selectedConversation.messages.length + 1) * 0.1, duration: 0.6 }}
                    className="ending-message"
                  >
                    <div className="ending-line"></div>
                    <p className="ending-text">{selectedConversation.endingMessage}</p>
                    <div className="ending-line"></div>
                  </motion.div>
                )}

                <Sparkle left="10%" top="20%" delay={0} />
                <Sparkle left="75%" top="45%" delay={1.5} />
                <Sparkle left="30%" top="70%" delay={2.8} />
                <Sparkle left="85%" top="15%" delay={0.7} />
                <Sparkle left="60%" top="80%" delay={3.2} />
              </div>

              <div className="chat-footer">
                <span className="footer-icon">📁</span>
                <span>MemoryOS v1.0 — Archive Viewer</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-state"
            >
              <div className="empty-icon">💬</div>
              <h3>Select a conversation</h3>
              <p>Choose a memory from the archive to explore it.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Sparkle({ left, top, delay }: { left: string; top: string; delay: number }) {
  return (
    <motion.div
      animate={{
        opacity: [0, 0.6, 0],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        position: 'absolute',
        left,
        top,
        width: '4px',
        height: '4px',
        background: '#e8b86a',
        borderRadius: '50%',
        boxShadow: '0 0 6px #e8b86a, 0 0 12px rgba(232,184,106,0.4)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}