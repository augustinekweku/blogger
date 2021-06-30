<template>
    <div>
        		<div class="content">
			<div class="container-fluid">
	
				<!--~~~~~~~ TABLE ONE ~~~~~~~~~-->
				<div class="_1adminOverveiw_table_recent _box_shadow _border_radious _mar_b30 _p20">
					<p class="_title0">Tags <Button icon="md-add" v-if="isWritePermitted" @click="addModal=true" >Add Tag</Button></p>

					<div class="_overflow _table_div">
						<table class="_table">
								<!-- TABLE TITLE -->
							<tr>
								<th>ID</th>
								<th>Tag Name</th>
								<th>Date Created</th>
								<th>Action</th>
							</tr>
								<!-- TABLE TITLE -->


								<!-- ITEMS -->
							<tr v-for="(tag, i) in tags" :key="i" v-if="tags.length">
								<td>{{ tag.id}}</td>
								<td class="_table_name">{{ tag.tagName }}</td>
								<td>{{tag.created_at}}</td>
								<td>
									<Button type="info" size="small" @click="showEditModal(tag, i)" v-if="isUpdatePermitted">Edit</Button>
									<Button type="error" size="small" @click="showDeletingModal (tag, i)" v-if="isDeletePermitted" :loading="tag.isDeleting">Delete</Button>
								</td>
							</tr>
								<!-- ITEMS -->

						</table>
					</div>
				</div>

				<!-- tag adding modal -->
				<Modal
					v-model="addModal"
					title="Add tag"
					:mask-closable="false"
					:closable="false"
					>
					<Input v-model="data.tagName" placeholder="Add Tag Name" />
					<div slot="footer">
						<Button type="error" @click="addModal=false">Close</Button>
						<Button type="primary" @click="addTag" :disabled="isAdding" :loading="isAdding ">{{isAdding ? 'Adding...' : 'Add tag'}}</Button>
					</div>
				</Modal>

				<!-- tag editing modal -->
				<Modal
					v-model="editModal"
					title="Edit tag"
					:mask-closable="false"
					:closable="false"
					>
					<Input v-model="editData.tagName" placeholder="Edit Tag Name" />
					<div slot="footer">
						<Button type="error" @click="editModal=false">Close</Button>
						<Button type="primary" @click="editTag" :disabled="isEditing" :loading="isEditing ">{{isEditing ? 'Editing...' : 'Edit tag'}}</Button>
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
				tagName: ''
			},
			addModal: false,
			isAdding: false,
			editModal: false,
			isEditing: false,   
			tags: [],
			editData: {
				tagName: ''
			},
			index: -1,
			showDeleteModal:false,
			deleteItem: {},
			isDeleting: false,
			deletingIndex: -1,

		}
	},
	components: {
        deleteModal
    },
	methods: {
		async addTag() {
			if (this.data.tagName.trim()=='') return this.error('Tag name is required');
			const res = await this.callApi('post', 'app/create_tag', this.data)
			if (res.status === 201) {
				this.tags.unshift(res.data)
				this.success('Tag added successfully')
				this.addModal = false
				this.data.tagName = ''
			}else {
				if (res.status===422) {
					if (res.data.errors.tagName) {
						this.e(res.data.errors.tagName[0])
					}
				}else{
				this.swr()
				}
			}
		},
				async editTag() {
			if (this.editData.tagName.trim()=='') return this.error('Tag name is required');
			const res = await this.callApi('post', 'app/edit_tag', this.editData)
			if (res.status === 200) {
				this.tags[this.index].tagName = this.editData.tagName
				this.success('Tag edited successfully')
				this.editModal = false
			}else {
				if (res.status===422) {
					if (res.data.errors.tagName) {
						this.e(res.data.errors.tagName[0])
					}
				}else{
				this.swr()
				}
			}
		},
		showEditModal(tag, index) {
			//to prevent real time editing 
			let obj = {
				id : tag.id,
				tagName : tag.tagName
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
		showDeletingModal(tag, i) {
			const deleteModalObj = {
            showDeleteModal: true,
            deleteUrl: 'app/delete_tag',
            data: tag,
            deletingIndex: -1,
			isDeleted: false,
			msg: 'Are you sure you want to delete this tag?',
			successMsg: 'Blog deleted successfully'
		}
		this.$store.commit('setDeletingModalObj', deleteModalObj)
		console.log('delete method called ')
		}
	},
	async created() {
		console.log(this.isWritePermitted)
		const res = await this.callApi('get', 'app/get_tags')
		if (res.status = 201) {
			this.tags = res.data
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
				this.tags.splice(this.deletingIndex, 1)

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