	hljs.initHighlightingOnLoad();

	let Field = {
		props:[
			'issueObject'
		],
		data(){
			return{
				issue:this.issueObject
			}
		},
		template:`
			<div class="code__issue">
				<h3>Issue of code</h3>
				<textarea 
					rows="15" 
					placeholder="e.g line 5 is throwing an exception" 
					id="body" 
					v-model="issue.body"
					@input="updateIssue"
				></textarea>

				<h3>Paste the highlight code</h3>

				<textarea 
					rows="15" 
					placeholder="paste the line of code you want to fix later" 
					id="code" 
					v-model="issue.issue" 
					@input="updateIssue"
				></textarea>
			</div>
			`,
		methods:{
			updateIssue(){
				this.$emit('update')
			}
		}
	}
	let Issue = {
		props:[
			'issueObject'
		],
		components:{
			'field':Field,
		},
		data(){
			return{
				open:false,
				issue:this.issueObject,
			}
		},
		computed:{
			Issue(){
				return this.issue.issue
			}
		},
		template:`
			<div class="issue">
				<a href="#" @click.prevent="openIssue">
					<span>{{ issue.body || 'Empty issue' }}</span>
				</a>	
				<pre>
					<code class="javascript">
						{{ Issue || 'Empty Issue' }}
					</code>
				</pre>
				<a href="#" @click.prevent="deleteIssue" class="delete__issue">Delete</a>

				<a href="#" 
					v-if="issue.fixed" 
					@click.prevent="fixIssue(issue.id)" 
					:class="{ 'fix__issue':issue.fixed}"
				>Mark as not fixed</a>
				<a href="#" 
					v-if="!issue.fixed" 
					@click.prevent="fixIssue(issue.id)" 
					class="fixed__issue"
				>Mark as fixed</a>
				<field v-if="open" :issue-object="issue" v-on:update="saveIssue(issue.id)"></field>
			</div>
		`,
		methods:{
			openIssue(){
				this.open = !this.open
			},
			fixIssue(id){
				this.issue.fixed = !this.issue.fixed
				let issues = JSON.parse(localStorage.getItem('issues')) || []
				issues.map((issue) => {
					if(issue.id == this.issue.id){
						issue.fixed = !issue.fixed
					}
				})

				localStorage.setItem('issues',JSON.stringify(issues));

			},
			saveIssue(id){
				let issues = JSON.parse(localStorage.getItem('issues')) || []

				issues.map((issue) => {
					if(issue.id == this.issue.id){
						issue.issue = this.issue.issue
						issue.body = this.issue.body
					}
				})

				localStorage.setItem('issues',JSON.stringify(issues));
			},
			deleteIssue(){
				this.$emit('deleteIssue',this.issue.id)
			}
		}
	}

	let Issues = {
		components:{

			'issue':Issue,

		},
		data(){
			return{
				issues:JSON.parse(localStorage.getItem('issues')) || [],
			}
		},
		template:`
				<div class="highlight__container">
					<a href="#" class="new__issue" @click.prevent="newIssue">Create new issue</a>
					<small class="helper">Click the issue to edit.</small>
					<issue v-for="issue in issues" :key="issue.id" :issue-object="issue" v-on:deleteIssue="deleteIssue"></issue>
				</div>
		`,
		methods:{
			deleteIssue(id){
				this.issues = this.issues.filter((issue) => {
					return issue.id !== id
				})

				localStorage.setItem('issues',JSON.stringify(this.issues));
			},
			newIssue(){
			 this.issues.unshift({
					id:Date.now(),
					body:'',
					issue:'',
					fixed:false,
				})

				localStorage.setItem('issues',JSON.stringify(this.issues))

			}
		}
	}
	let app = new Vue({
		el:'#app',
		components:{
			'issues':Issues,
		}
	})
