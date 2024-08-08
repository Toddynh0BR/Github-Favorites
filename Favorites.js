import { GithubUser } from "./GithubUser.js"



export class Favorites {

   

    constructor(root) {
        this.root = document.querySelector(root)
        this.load()
        
    }


    load() {

        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []

        }
    
    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }




    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login === username)

            if(userExists){
                throw new Error('Usuário já cadastrado')
            }



            const user = await GithubUser.search(username)

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()


            } catch(error) {
                alert(error.message)
            }        

    }



    
    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }


   
}



// classe que vai criar a visualização e eventos do HTML

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('.box .scroll table tbody')

        this.update()
        this.onadd()
    }



    onadd() {
        const addButton = this.root.querySelector('button')
        addButton.onclick = () => {
            const input = this.root.querySelector('.search input')
            const value = input.value

            if (!value){
             return alert("Enter a username!")
            }
            this.add(value)
            input.value = ''
        }
    }
    

    update() {
        this.removeAllTr()
        
        this.entries.forEach(user => {
            const row = this.createRow()
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repository').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Are you sure you want to delete this line?')

                if(isOk) {
                    this.delete(user)
                }
            }
            

            this.tbody.append(row)
        })
        
        const c = document.querySelector('.c');
        if (this.tbody.innerHTML.trim() === '') {
            c.classList.remove('hide')
        } else {
            c.classList.add('hide')
        }
        
    }

    createRow() {
        const tr = document.createElement('tr')
        tr.innerHTML = `
        <td class="user">
        <img src="https://github.com/maykbrito.png" alt="imagem de maykbrito">
        <a href="https://github.com/maykbrito" target="_blank">
            <p translate="no">Mayk Brito</p>
            <span translate="no">/maykbrito</span>
        </a>
        </td>
        <td class="repository">
        126
        </td>
        <td class="followers">
        1234
        </td>
        <td class="action">
        <p class="remove" >Remove</p>
        </td>
        `
        

        return tr

        }




    removeAllTr() {


        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        });
    }
}

