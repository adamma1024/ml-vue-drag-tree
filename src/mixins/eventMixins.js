export default {
  methods: {
    removeChild (parent, node) {
      this.$emit('on-node-data-change', 'remove', parent, node)
    },
    addChild (parent, node) {
      this.$emit('on-node-data-change', 'add', parent, node)
    },
    endChange () {
      this.$emit('on-change-end', this.data)
    }
  }
}
