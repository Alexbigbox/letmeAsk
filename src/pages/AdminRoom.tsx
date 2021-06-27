import { useParams, useHistory } from 'react-router-dom';
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';
import { Question } from '../components/Question';
import { Fragment } from 'react';

import Modal from 'react-modal';


import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';


import { useRoom } from '../hooks/useRoom';

import '../styles/room.scss';
import { database } from '../services/firebase';
import { useState } from 'react';


// import { useAuth } from '../hooks/useAuth';



type RoomParams = {
    id: string;
}

export function AdminRoom() {
    // const { user } = useAuth();
    const params = useParams<RoomParams>();
    const roomId = params.id;
    const history = useHistory();

    const [isModalVisible, setIsModalVisible] = useState(false);

    const { title, questions} = useRoom(roomId);
  
    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history.push('/');
    }
    async function handleDeleteQuestion(questionId: string) {
        
        if (window.confirm('Você tem certeza que deseja excluir esta pergunta?')) {
         await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
     
    }


    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }
    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        });
    } 

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="letmeAsk" />
                    
                    <div>
                        <RoomCode code={roomId} />
                        <div><Button isOutlined onClick={handleEndRoom}>Encerrar a sala</Button></div>
                    </div>
                </div>
            </header>

            <main id="main1">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{ questions.length } Perguntas</span>}
                </div>

                
                <div className="question-list">
                    {questions.map(question => {
                        return (
                      <Fragment  key={question.id}>      
                        <Question 
                           
                            content={question.content}
                            author={question.author}
                            isAnswered={question.isAnswered}
                            isHighlighted={question.isHighlighted}
                        >
                            {!question.isAnswered && (
                              <>  
                                <button
                                type="button"
                                onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                >
                                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleHighlightQuestion(question.id)}
                                >
                                    <img src={answerImg} alt="Destacar a pergunta" />
                                </button>
                              </>  
                            )}

                            <button
                                type="button"
                                onClick={() => setIsModalVisible(true)}
                            >
                                <img src={deleteImg} alt="Remover Pergunta" />
                            </button>
                        </Question>
                        <Modal 
                        isOpen={isModalVisible}
                        onRequestClose={() => setIsModalVisible(false)}
                            >
                            <button onClick={() => handleDeleteQuestion(question.id)}>Deletar</button>
                            <button 
                            onClick={() => setIsModalVisible(false)}
                            >
                                Fechar
                            </button>
                        </Modal> 
                      </Fragment>   
                        );
                    })}
                </div>
            </main>

        </div>
    )
}