import { StyleSheet, Platform } from 'react-native';

export const globalStyles = StyleSheet.create({
  mainContainer: {
  flex: 1,
  backgroundColor: '#FFF',
  ...Platform.select({
    web: {
      height: '100vh',
      overflowY: 'auto',
      position: 'fixed',
      width: '100%',}
  })
},
  scrollContent: {
    padding: 20,
    paddingBottom: Platform.OS === 'web' ? 200 : 100,
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    flexGrow: 1, 
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnFinalizar: {
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    margin: 18,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  subtitle: { fontSize: 14, 
    color: '#e50e0e', 
    fontWeight: 'bold',
    marginBottom: 25, 
    textAlign: 'center' },
  footerCarousel: {
    position: 'relative',
    bottom: 0,
    width: '100%',
    zIndex: 9999, 
    elevation: 10, 
    backgroundColor: '#fff',
  }
});