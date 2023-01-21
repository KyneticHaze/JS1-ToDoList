//Tüm elementleri seçme
const form = document.querySelector("#todo-form");
const TodoInput = document.querySelector("#todo");
const todoList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];
const filter = document.querySelector("#filter");
const clearButton = document.querySelector("#clear-todos");


eventlisteners(); //! tüm eventlistenerleri çalıştır

//* Dikkatli incelersen yöntem olarak bir eventlistenerlar fonksiyonu içinde fazlaca eventlistener kullanıldı.
//* Her bir event listener için de bir veya birkaç fonksiyon oluşturuldu.

//! Bu yöntem üstünde uğraşıp kendi başına yapabilmen gereken bir yöntem
//! Bir UI'da işlevler silsilesini barındıran bu etkinlik oldukça faydalı!

function eventlisteners(){ //! Tüm eventlistener'lar
    form.addEventListener('submit',addTodo);
    document.addEventListener("DOMContentLoaded",loadAllTodosUI);
    secondCardBody.addEventListener('click',deleteTodo); //! Event Capturing için secondCardBody seçildi.
    filter.addEventListener('keyup',filterTodos);
    clearButton.addEventListener('click',clearAllTodos);
}

//! Tüm todo'ları silme
function clearAllTodos(){
    if(confirm("Tümünü silmek istediğinize emin misiniz?")){
        //Arayüzden todoları temizleme

        //- todoList.innerHTML = ""; //Yavaş yöntem

        while(todoList.firstElementChild != null){ //! Listeyi kapsayan ul'nin ilk elemanına karşılık gelen değer null olana kadar içindeki fonksiyon dönecek
            todoList.removeChild(todoList.firstElementChild); //* ul'nin içindeki ilk çocuk elemanı kaldırma
            //* Silme döngüsü her başlağığında silinenden sonraki ilk eleman olacağı için döngü devam eder. Tüm çcocuk elemanlar silindiğinde de null değeri döner!
        }

        localStorage.removeItem("todos"); //! Buradaki işlem çok daha basit. Storage'den todos key'ini kaldırınca value'nun içinde bulunanların hepsi kaldırılır!
    }


    
}


function filterTodos(e){
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
     
    listItems.forEach(function(listItem){
        const text = listItem.textContent.toLowerCase();

        if(text.indexOf(filterValue) === -1){
            //Bulamadı

            listItem.setAttribute("style","display : none !important");
        }

        else {
            //bulduysa
            listItem.setAttribute("style","display : block");
        }
    })
}


//! Todo silme
function deleteTodo(e){
    if (e.target.className === "fa fa-remove"){ //! class'a sahipse 
        e.target.parentElement.parentElement.remove(); //! ebeveyninin ebeveyni olan list-group-item class'lı li'leri sil.
        deleteTodoFromStorage(e.target.parentElement.parentElement.textContent); //! ebeveyninin ebeveyni olan list-group-item'ın içerdiği bilgi storage'de olduğu için onun textContent'ini sil.
        showAlert("success","Todo Başarıyla Silindi!") //! İşlemin bilgilendirme mesajı
    }
}

//! Storage'den todo silme
function deleteTodoFromStorage(deletetodo){
    let todos = getTodosFromStorage();

    todos.forEach(function(todo,index){
        if(todo === deletetodo){
            todos.splice(index,1); //! splice(yeni elemanların eklenmesi gereken konumu gösterir,kaç elemanın kaldırılması gerektiğini gösterir);
        }
    });

    localStorage.setItem("todos",JSON.stringify(todos));
}


//! Sayfa yüklendiğinde todolar gitmiyor bu fonksiyonla
function loadAllTodosUI(){ 
    let todos = getTodosFromStorage(); //! Obje halindeki todo'ları çağır ve todos'a ata.

    todos.forEach(function(todo){  //! her bir todo'yu UI'e ekle. Bu işlemle sayfa tekrar yüklendiğinde silinmeyen todolar ortaya çıkar.
        addTodoToUI(todo);
    })
}

//!- Input verisini alma ve todo olarak UI'a ekleme işlemi
function  addTodo(e){
    const newTodo = TodoInput.value.trim();

    if(newTodo === ""){
        showAlert("danger","Lütfen bir todo girin!");
    }else {
        addTodoToUI(newTodo);
        addTodoToStorage(newTodo);
        showAlert("success","Başarıyla Eklendi!")
    }

    

    e.preventDefault();
}

//! Eklenecek todo'yu oluşturma ve arayüzde göstermeyi bekleyen işlem
function addTodoToUI(newTodo){ //String değerini list item olarak arayüze ekleyecek
    //List item oluşturma
    const listItem = document.createElement("li");
    //Link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";
    
    //Text node ekleme
    listItem.appendChild(document.createTextNode(newTodo));
    listItem.appendChild(link);

    //' TodoList'e List item ekleme
    todoList.appendChild(listItem);

    TodoInput.value = "";
}

//! Todo'yu storage'den varsa çağırma yoksa boş liste ekleme
function getTodosFromStorage(){ //Storage'dan todoları alma
    let todos;

    if(localStorage.getItem("todos") === null){ //! todos key'li item, storage'de yoksa todos isimli değişkene boş bir liste atanır
        todos = [];
    }
    else { //! todos key'li item varsa o itemin karşılığı todos değişkenine atanır

        todos = JSON.parse(localStorage.getItem("todos")); //* JSON.parse verileri stringden bir objeye çevirir.
    }
    return todos;
}

//! Todo'yu storage'ye ekleme

function addTodoToStorage(newTodo){
    let todos = getTodosFromStorage(); //! todos değişkenine storage'daki itemi çağırma işlevi uygulanır 
    todos.push(newTodo);

    localStorage.setItem("todos",JSON.stringify(todos)); //! liste veri tipli todos değişkeni "todos" key'inin value'su olarak atanır. 
                        //* JSON.stringify ise verileri stringe çevirir.
}


//! Bildirme Mesajları işlemi
function showAlert(type,message){
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);

    setTimeout(function(){
        alert.remove();
    },1000);
}

