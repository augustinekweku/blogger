<template>
    <div>
        		<div class="content">
			<div class="container-fluid">
	
				<!--~~~~~~~ TABLE ONE ~~~~~~~~~-->
				<div class="_1adminOverveiw_table_recent _box_shadow _border_radious _mar_b30 _p20">
					<p class="_title0">Admin Users <Button icon="md-add" @click="addModal=true" >Add Admin</Button></p>

					<div class="_overflow _table_div">
						<table class="_table">
								<!-- TABLE TITLE -->
							<tr>
								<th>ID</th>
								<th> Name</th>
								<th>Email</th>
								<th>User Role</th>
								<th>Date Created</th>
								<th>Action</th>
							</tr>
								<!-- TABLE TITLE -->


								<!-- ITEMS -->
							<tr v-for="(user, i) in users" :key="i" v-if="users.length">
								<td>{{ user.id}}</td>
								<td class="_table_name">{{ user.fullName }}</td>
								<td>{{user.email}}</td>
								<td>{{user.role_id}}</td>
								<td>{{user.created_at}}</td>
								<td>
									<Button type="info" size="small" @click="showEditModal(user, i)">Edit</Button>
									<Button type="error" size="small" @click="showDeletingModal (user, i)" :loading="user.isDeleting">Delete</Button>
								</td>
							</tr>
								<!-- ITEMS -->

						</table>
					</div>
				</div>

				<!-- Admin adding modal -->
				<Modal
					v-model="addModal"
					title="Add Admin User"
					:mask-closable="false"
					:closable="false"
					>
                    <div class="space">
					<Input type="text" v-model="data.fullName" placeholder="Full Name" />                        
                    </div>                    
                    <div class="space">
					<Input type="email" v-model="data.email" placeholder="Email" />
                    </div>                    
                    <div class="space">
					<Input type="password" v-model="data.password" placeholder="Password" />
                    </div>
                    <div class="space">
                        <Select v-model="data.role_id"  placeholder="Select Admin Type">
                    <Option :value="r.id" v-for="(r, i) in roles" :key="i" v-if="roles.length">{{r.roleName}}</Option>
                        </Select>    
                    </div>
                    
					<div slot="footer">
						<Button type="error" @click="addModal=false">Close</Button>
						<Button type="primary" @click="addAdmin" :disabled="isAdding" :loading="isAdding ">{{isAdding ? 'Adding...' : 'Add Admin'}}</Button>
					</div>
				</Modal>

				<!-- user editing modal -->
				<Modal
					v-model="editModal"
					title="Edit Admin User"
					:mask-closable="false"
					:closable="false"
					>
					<div class="space">
					<Input type="text" v-model="editData.fullName" placeholder="Full Name" />                        
                    </div>                    
                    <div class="space">
					<Input type="email" v-model="editData.email" placeholder="Email" />
                    </div>                    
                    <div class="space">
					<Input type="password" v-model="editData.password" placeholder="Password" />
                    </div>
                    <div class="space">
                        <Select v-model="editData.role_id"  placeholder="Select Admin Type">
                    <Option :value="r.id" v-for="(r, i) in roles" :key="i" v-if="roles.length">{{r.roleName}}</Option>
                        </Select>    
                    </div>
					<div slot="footer">
						<Button type="error" @click="editModal=false">Close</Button>
						<Button type="primary" @click="editAdmin" :disabled="isEditing" :loading="isEditing ">{{isEditing ? 'Editing...' : 'Edit Admin'}}</Button>
					</div>
				</Modal>

				<!-- delete alert modal -->
				<!-- <Modal v-model="showDeleteModal" width="360">
					<p slot="header" style="color:#f60;text-align:center">
						<Icon type="ios-information-circle"></Icon>
						<span>Delete confirmation</span>
					</p>
					<div style="text-align:center">
						<p>Are you sure you want delete this tag?</p>
					</div>
					<div slot="footer">
						<Button type="error" size="large" long :loading="isDeleting" :disabled="isDeleting" @click="deleteTag">Delete</Button>
					</div>
				</Modal> -->
				<deleteModal></deleteModal>

			</div>
		</div>
    </div>
</template>

<script>
import deleteModal from '../components/deleteModal.vue'
import { mapGetters } from 'vuex';

export default {
	data() {
		return {
			data:{
				fullName: '',
				email: '',
				password: '',
				role_id: null,
			},
			addModal: false,
			isAdding: false,
			editModal: false,
			isEditing: false,   
			users: [],
			editData: {
				fullName: '',
				email: '',
				password: '',
				role_id: null,

			},
			index: -1,
			showDeleteModal:false,
			deleteItem: {},
			isDeleting: false,
			deletingIndex: -1,
			websiteSetting: [],
			roles:[],
		}
	},
	components: {
        deleteModal
    },
	methods: {
		async addAdmin() {
			if (this.data.fullName.trim()=='') return this.error('Full name is required');
			if (this.data.email.trim()=='') return this.error('Email is required');
			if (this.data.password.trim()=='') return this.error('Password is required');
			if (!this.data.role_id) return this.error('User Role is required');

			const res = await this.callApi('post', 'app/create_user', this.data)
			if (res.status === 201) {
				this.users.unshift(res.data)
				this.success('Admin User added successfully')
				this.addModal = false
				this.data.fullName = ''
				this.data.email = ''
				this.data.password = ''
				this.data.userType = ''
			}else {
				if (res.status===422) {
					console.log(res.data.errors)
					for(let i in res.data.errors){
						this.error(res.data.errors[i][0])
					}
					}else{
				this.swr()
				}
			}
		},
				async editAdmin() {
			if (this.editData.fullName.trim()=='') return this.error('Full name is required');
			if (this.editData.email.trim()=='') return this.error('Email is required');
			if (!this.editData.role_id) return this.error('User Role is required');
			const res = await this.callApi('post', 'app/edit_user', this.editData)
			if (res.status === 200) {
				this.users[this.index] = this.editData
				this.success('Admin User edited successfully')
				this.editModal = false
			}else {
				if (res.status===422) {
					for(let i in res.data.errors){
						this.error(res.data.errors[i][0])
					}
				}else{
				this.swr()
				}
			}
		},
		showEditModal(user, index) {
			//to prevent real time editing 
			let obj = {
				id : user.id,
				fullName : user.fullName,
				email : user.email,
				userType : user.userType,
			}
			this.editData = obj
			this.editModal = true
			this.index = index
		},
		// async deleteTag() {
		// 	this.isDeleting = true
		// 	const res = await this.callApi('post', 'app/delete_tag', this.deleteItem)
		// 	if (res.status === 200) {
		// 		this.users.splice(this.deletingIndex, 1)
		// 		this.success('Tag has been deleted successfully')
		// 	} else {
		// 		this.swr()
		// 	}
		// 	this.isDeleting = false
		// 	this.showDeleteModal = false

		// },
		showDeletingModal(tag, i) {
			const deleteModalObj = {
            showDeleteModal: true,
            deleteUrl: 'app/delete_tag',
            data: tag,
            deletingIndex: -1,
            isDeleted: false,
		}
		this.$store.commit('setDeletingModalObj', deleteModalObj)
		console.log('delete method called ')
		}
	},
	async created() {
		const [res, resRole] = await Promise.all([
			this.callApi('get', 'app/get_users'),
			this.callApi('get', 'app/get_roles')
		])
		if (res.status = 201) {
			this.users = res.data
		} else {
			this.swr()
		}             
		if (resRole.status = 201) {
			this.roles = resRole.data
		} else {
			this.swr()
		}
	},
	computed: {
		...mapGetters([
			'getDeleteModalObj'
		])
	},
	watch: {
		getDeleteModalObj(obj) {
			console.log(obj)
			if (obj.isDeleted) {
				this.users.splice(this.deletingIndex, 1)

			}
		}
	}
	// async created() {
	// 	const res = await this.callApi('post', '/app/create_tag', {tagName : 'testtag'});
	// 		if (res.status == 200) {
	// 		//console.log(res)
	// 	}else{
	// 		console.log(res)
	// 		console.log('running')
	// 	}
	// },

}
</script>