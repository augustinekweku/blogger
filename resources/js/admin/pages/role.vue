<template>
    <div>
        		<div class="content">
			<div class="container-fluid">
	
				<!--~~~~~~~ TABLE ONE ~~~~~~~~~-->
				<div class="_1adminOverveiw_table_recent _box_shadow _border_radious _mar_b30 _p20">
					<p class="_title0">Role Management <Button icon="md-add" @click="addModal=true" >Add a New Role</Button></p>

					<div class="_overflow _table_div">
						<table class="_table">
								<!-- TABLE TITLE -->
							<tr>
								<th>ID</th>
								<th>Role Type</th>
								<th>Date Created</th>
								<th>Action</th>
							</tr>
								<!-- TABLE TITLE -->


								<!-- ITEMS -->
							<tr v-for="(role, i) in roles" :key="i" v-if="roles.length">
								<td>{{ role.id}}</td>
								<td class="_table_name">{{ role.roleName }}</td>
								<td>{{role.created_at}}</td>
								<td>
									<Button type="info" size="small" @click="showEditModal(role, i)">Edit</Button>
									<Button type="error" size="small" @click="showDeletingModal (role, i)" :loading="role.isDeleting">Delete</Button>
								</td>
							</tr>
								<!-- ITEMS -->

						</table>
					</div>
				</div>

				<!-- role adding modal -->
				<Modal
					v-model="addModal"
					title="Add Role"
					:mask-closable="false"
					:closable="false"
					>
					<Input v-model="data.roleName" placeholder="Role Name" />
					<div slot="footer">
						<Button type="error" @click="addModal=false">Close</Button>
						<Button type="primary" @click="add" :disabled="isAdding" :loading="isAdding ">{{isAdding ? 'Adding...' : 'Add Role'}}</Button>
					</div>
				</Modal>

				<!-- tag editing modal -->
				<Modal
					v-model="editModal"
					title="Edit Role"
					:mask-closable="false"
					:closable="false"
					>
					<Input v-model="editData.roleName" placeholder="Edit Role Name" />
					<div slot="footer">
						<Button type="error" @click="editModal=false">Close</Button>
						<Button type="primary" @click="edit" :disabled="isEditing" :loading="isEditing ">{{isEditing ? 'Editing...' : 'Edit Role'}}</Button>
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
				roleName: ''
			},
			addModal: false,
			isAdding: false,
			editModal: false,
			isEditing: false,   
			roles: [],
			editData: {
				roleName: ''
			},
			index: -1,
			showDeleteModal:false,
			deleteItem: {},
			isDeleting: false,
			deletingIndex: -1
		}
	},
	components: {
        deleteModal
    },
	methods: {
		async add () {
			if (this.data.roleName.trim()=='') return this.error('Role name is required');
			const res = await this.callApi('post', 'app/create_role', this.data)
			console.log(res.status)
			if (res.status === 201) {
				this.roles.unshift(res.data)
				this.success('Role added successfully')
				this.addModal = false
				this.data.roleName = ''
			}else {
				if (res.status===422) {
					if (res.data.errors.roleName) {
						this.e(res.data.errors.roleName[0])
					}
				}else{
				this.swr()
				}
			}
		},
			async edit() {
			if (this.editData.roleName.trim()=='') return this.error('Role name is required');
			const res = await this.callApi('post', 'app/edit_role', this.editData)
			if (res.status === 200) {
				this.roles[this.index].roleName = this.editData.roleName
				this.success('Role edited successfully')
				this.editModal = false
			}else {
				if (res.status===422) {
					if (res.data.errors.roleName) {
						this.e(res.data.errors.roleName[0])
					}
				}else{
				this.swr()
				}
			}
		},
		showEditModal(role, index) {
			//to prevent real time editing 
			let obj = {
				id : role.id,
				roleName : role.roleName
			}
			this.editData = obj
			this.editModal = true
			this.index = index
		},
		// async deleteTag() {
		// 	this.isDeleting = true
		// 	const res = await this.callApi('post', 'app/delete_tag', this.deleteItem)
		// 	if (res.status === 200) {
		// 		this.tags.splice(this.deletingIndex, 1)
		// 		this.success('Tag has been deleted successfully')
		// 	} else {
		// 		this.swr()
		// 	}
		// 	this.isDeleting = false
		// 	this.showDeleteModal = false

		// },
		showDeletingModal(role, i) {
			const deleteModalObj = {
            showDeleteModal: true,
            deleteUrl: 'app/delete_role',
            data: role,
            deletingIndex: -1,
			isDeleted: false,
            msg: 'Are you sure you want to delete this Role?',
			successMsg: 'Role deleted successfully'

		}
		this.$store.commit('setDeletingModalObj', deleteModalObj)
		console.log('delete method called ')
		}
	},
	async created() {
		const res = await this.callApi('get', 'app/get_roles')
		if (res.status = 201) {
			this.roles = res.data
			console.log(res.data)
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
				this.tags.splice(obj.deletingIndex, 1)

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