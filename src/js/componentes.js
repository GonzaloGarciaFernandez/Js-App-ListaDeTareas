import { todoList } from "../index";
import { Todo } from "../classes";

//Referencias en el HTML:
const divTodoList           = document.querySelector('.todo-list');
const txtInput              = document.querySelector('.new-todo');
const btnBorrarCompletados  = document.querySelector('.clear-completed');
const ulFiltros             = document.querySelector('.filters');
const anchorFiltros         = document.querySelectorAll('.filtro');


//Funciones:
export const crearTodoHtml = (todo) =>{

    const htmlTodo = `
        <li class="${ (todo.completado)? 'completed' : '' }" data-id="${todo.id}">
            <div class="view">
                <input class="toggle" type="checkbox" ${ (todo.completado)? 'checked' : '' }>
                <label>${todo.tarea}</label>
                <button class="destroy"></button>
            </div>
            <input class="edit" value="Create a TodoMVC template">
		</li>`

    const div = document.createElement('div');
    div.innerHTML = htmlTodo;

    divTodoList.append(div.firstElementChild);

    return div;
    
};


//Eventos:
txtInput.addEventListener('keyup', (event)=>{
    //console.log(event);
    //keyCode 13 es el evento al presioar Enter
    if (event.keyCode === 13 && txtInput.value.length >0){ 
        const nuevoTodo = new Todo(txtInput.value);
        todoList.nuevoTodo(nuevoTodo);
        crearTodoHtml(nuevoTodo);
        txtInput.value='';
    };
});

divTodoList.addEventListener('click', (event)=>{
    //Saber que parte toco del elemento
    const nombreElemento = event.target.localName; //input, laber, button
    const todoElemento = event.target.parentElement.parentElement; //referencia al li
    const todoId = todoElemento.getAttribute('data-id'); //extraemos el id del elemento li

    if( nombreElemento.includes('input') ){ //click en check
        todoList.marcarCompletado(todoId);
        todoElemento.classList.toggle('completed'); //veo todas las clases y agrego la clase complete
    }else if( nombreElemento.includes('button') ){ // hay que borrar el todo
        todoList.eliminarTodo(todoId);
        divTodoList.removeChild(todoElemento); // eliminar elemento para que no quede persistente
    };
});

btnBorrarCompletados.addEventListener('click', ()=>{
    todoList.eliminarCompletados();

    for(let i = divTodoList.children.length-1; i>=0; i--){
        const elemento = divTodoList.children[i];
        if( elemento.classList.contains('completed')){ //saber si el elemento está completado
            divTodoList.removeChild(elemento);
        };
    };
});

ulFiltros.addEventListener('click', (event)=>{
    const filtro = event.target.text; //toma el texto cuando se hace click, puede venir undefined
    if(!filtro){return;};

    anchorFiltros.forEach(elem => elem.classList.remove('selected'));
    event.target.classList.add('selected');

    for(const elemento of divTodoList.children){
        elemento.classList.remove('hidden');
        const completado = elemento.classList.contains('completed');

        switch(filtro){
            case 'Pendientes':
                if(completado){
                    elemento.classList.add('hidden');
                };
            break;

            case 'Completados':
                if(!completado){
                    elemento.classList.add('hidden');
                };
            break;
        };
    };
});
